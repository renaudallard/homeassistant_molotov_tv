// The etincelle receiver's ad break search (its <ad-rule> and <ad-skip> blocks), as it is.
// Written by ad-skip.sh from the receiver's index.html: change it there, then copy it again.
        // <ad-rule>
        // Skipping ad breaks. The rules are those of the etincelle apps (their BreakGuess and AdBreaks),
        // with times in seconds: what a stream marks of its breaks is read from its manifest; what it
        // does not is guessed, from the logo that sits in a corner of the picture through the programme
        // and is gone during the adverts (the channel's, in an upper corner, first; a picture with a
        // show's own, lower down, is the programme's too), and in a recording from its captions too
        // (a programme speaks for minutes, an advert for seconds). All of it is offered with a pill,
        // never skipped unasked.
        const AdRule = (() => {
            // A break lasts between these: under, it is a pause or a scene without a word; over, the
            // end of one programme and the start of another, a programme without captions being as
            // silent as adverts. Without the logo, as programmes show it, a break can last up to
            // LOGO_MAX_S: adverts and trailers fill eighteen and a half minutes between M6's evening
            // news and its sitcom.
            const MIN_S = 150;
            const MAX_S = 800;
            const LOGO_MAX_S = 1200;
            // A run of captions this long is programme; a run holds silences of up to CAPTION_GAP segments.
            const PROGRAMME_S = 60;
            const CAPTION_GAP = 3;
            // What two guesses of a break must share to be the same one, and how far apart their edges
            // may be for the logo's, the sharper, to be taken.
            const SHARED_S = 60;
            const EDGE_S = 90;
            // The share of its usual score under which a picture is without the logo, the pictures
            // either side it is smoothed with, the fewest without it that count (fewer are a bright
            // scene or a badge over it), the pictures with it a break may hold, and the pictures wanted
            // on each side with how many of them at least must have it.
            const GONE = 0.5;
            const SMOOTH = 2;
            const SOLID = 5;
            const BRIDGE = 7;
            const AROUND = 15;
            const MOSTLY = 8;
            // The pictures a piece at either end of a break must last to stay part of it when only
            // the bridge holds it there.
            const END_PIECE = 10;
            // Of the AROUND pictures on each side of a stretch without the show's logo, how many at
            // least must have the channel's for it to be a break the channel's alone did not give, and
            // the share of the stretch that must be without the channel's too.
            const CLEAR = 12;
            const SHOW_LED = 0.5;
            // The most pictures in a row the second logo may show in a break, the channel's being gone
            // with it, for them to be a trailer or a sponsor that carries it (Paris Première's
            // pictogram) rather than the programme; and the most the channel's may be seen, the second
            // gone the while, for them to be an advert with its brand in that corner (M6's faint logo).
            const SHORT_SHOW = 10;
            const BRAND = 12;
            // The share of a picture a corner takes, of a corner's points that are the logo, the least
            // a logo's edges must stand out, and those of a show's own beside the channel's: a fainter
            // one, as a band of text along the bottom, is matched by the notices along the bottom of
            // adverts, which then pass for the programme and part the break.
            const CORNER = 0.22;
            const MASK = 0.92;
            const STRONG = 25;
            const BESIDE = 30;
            // How many of the corners, the first ones, are the upper ones.
            const UPPER = 2;
            // Marked breaks this close are one; and the shape of a break on a stream that marks
            // nothing but cuts itself at each one: a jingle between two stretches of adverts, of one
            // to seven minutes (just over six in BFMTV's long breaks at night), or one such stretch
            // alone between two longer ones.
            const MERGE_GAP_S = 10;
            const JINGLE_MAX_S = 10;
            const HALF_MIN_S = 60;
            const HALF_MAX_S = 420;

            // The runs of true in flags, each as [first, last], holding up to bridge false in a row.
            function runs(flags, bridge) {
                const out = [];
                let i = 0;
                while (i < flags.length) {
                    if (!flags[i]) {
                        i++;
                        continue;
                    }
                    let last = i;
                    let j = i + 1;
                    while (j < flags.length && j - last <= bridge + 1) {
                        if (flags[j]) last = j;
                        j++;
                    }
                    out.push([i, last]);
                    i = last + 1;
                }
                return out;
            }

            // The breaks the captions give away; null when the programme has too few to tell.
            function captionBreaks(spoken, first, seg) {
                let said = 0;
                for (const s of spoken) if (s) said++;
                if (!(seg > 0) || said * 2 < spoken.length) return null;
                const programme = runs(spoken, CAPTION_GAP).filter(r => (r[1] - r[0] + 1) * seg >= PROGRAMME_S);
                const out = [];
                for (let k = 0; k + 1 < programme.length; k++) {
                    const before = programme[k];
                    const after = programme[k + 1];
                    const start = first + (before[1] + 1) * seg;
                    const end = first + after[0] * seg;
                    let inside = 0;
                    for (let i = before[1] + 1; i < after[0]; i++) if (spoken[i]) inside++;
                    if (end - start >= MIN_S && end - start <= MAX_S && inside * 2 < after[0] - before[1] - 1) out.push([start, end]);
                }
                return out;
            }

            // Of each picture, whether it is without the logo. One not given has it, and is no neighbour.
            function gone(score, usual, given) {
                const out = new Array(score.length).fill(false);
                for (let i = 0; i < score.length; i++) {
                    if (!given[i]) continue;
                    const near = [];
                    for (let j = Math.max(0, i - SMOOTH); j <= Math.min(score.length - 1, i + SMOOTH); j++) {
                        if (given[j]) near.push(score[j]);
                    }
                    near.sort((a, b) => a - b);
                    out[i] = near[near.length >> 1] < GONE * usual;
                }
                return out;
            }

            // gone without its strays.
            function solid(flags) {
                const out = new Array(flags.length).fill(false);
                for (const r of runs(flags, 0)) {
                    if (r[1] - r[0] + 1 >= SOLID) for (let i = r[0]; i <= r[1]; i++) out[i] = true;
                }
                return out;
            }

            // The stretches without the logo that have the programme on both sides and last what a
            // break does, as [first, last] pictures: held together by the bridge, and by a trailer or
            // a brand (see logoBreaks) where those are given.
            function breakRuns(flags, step, trailer, brand, lengthen) {
                const firm = solid(flags);
                const programme = (from, to) => {
                    if (from < 0 || to > firm.length) return false;
                    let with_ = 0;
                    for (let i = from; i < to; i++) if (!firm[i]) with_++;
                    return with_ >= MOSTLY;
                };
                const isBreak = r => {
                    const length = (r[1] + 1 - r[0]) * step;
                    return programme(r[0] - AROUND, r[0]) && programme(r[1] + 1, r[1] + 1 + AROUND) && length >= MIN_S && length <= LOGO_MAX_S;
                };
                const held = runs(firm, BRIDGE);
                if (!trailer || !brand) return held.filter(isBreak);
                // No short part to lengthen one with: it is never a break by itself either.
                const joinable = lengthen ? held.filter(r => r[1] - r[0] + 1 >= END_PIECE) : held;
                // Parts joined that are no break together are taken each by itself, as are those none of
                // which is a break by itself where a join is only to lengthen one.
                const out = [];
                for (const r of joined(joinable, trailer, brand, step)) {
                    const parts = joinable.filter(p => p[0] >= r[0] && p[1] <= r[1]);
                    if (isBreak(r) && (!lengthen || parts.length === 1 || parts.some(isBreak))) out.push(r);
                    else for (const p of parts) if (isBreak(p)) out.push([p[0], p[1]]);
                }
                return out;
            }

            // held with those parted only by a trailer or a brand, with up to BRIDGE other pictures,
            // made one, unless that one would be longer than a break may be.
            function joined(held, trailer, brand, step) {
                const out = [];
                for (const r of held) {
                    const last = out[out.length - 1];
                    if (last && (r[1] + 1 - last[0]) * step <= LOGO_MAX_S && partedBy(last[1] + 1, r[0], trailer, brand)) last[1] = r[1];
                    else out.push([r[0], r[1]]);
                }
                return out;
            }

            // Whether the pictures from from below to hold a trailer or a brand, with up to BRIDGE
            // other pictures, and no more of either.
            function partedBy(from, to, trailer, brand) {
                let known = 0;
                for (let i = from; i < to; i++) if (trailer[i] || brand[i]) known++;
                return to - from <= SHORT_SHOW + BRAND + BRIDGE && known >= to - from - BRIDGE &&
                    longest(trailer, from, to) <= SHORT_SHOW && longest(brand, from, to) <= BRAND;
            }

            // The most flags in a row from from below to.
            function longest(flags, from, to) {
                let row = 0;
                let most = 0;
                for (let i = from; i < to; i++) {
                    row = flags[i] ? row + 1 : 0;
                    most = Math.max(most, row);
                }
                return most;
            }

            // Those stretches as [start, end]. With a second logo, lowerFlags tells of each picture
            // whether it is without that one: a break is then what is left of one once the pictures
            // that show the second logo are taken for the programme's. The second logo shown at most
            // SHORT_SHOW pictures in a row, the first gone the while (a trailer that carries the
            // channel's pictogram), does not part two pieces of a break; nor does the first seen at
            // most BRAND pictures in a row, the second gone the while (an advert with its brand in the
            // first one's corner), and that from the first look on where another part is a break by
            // itself and it is no shorter than an end piece (a new programme whose show's logo is not
            // the one learnt looks like such a brand); parts so joined that are no break together are
            // taken each by itself. And a stretch without the second logo that the first gave nothing
            // in is a break too when the first is gone through at least half of it and plainly there
            // on each side (adverts that keep it seen, as Gulli's toys), its short end pieces given up
            // as for the others: never past its return.
            function logoBreaks(flags, first, step, lowerFlags) {
                let without = flags;
                const brand = lowerFlags ? flags.map((f, i) => !f && lowerFlags[i]) : null;
                const trailers = lowerFlags ? flags.map((f, i) => f && !lowerFlags[i]) : null;
                let found = breakRuns(without, step, trailers, brand, true);
                if (lowerFlags) {
                    without = new Array(flags.length).fill(false);
                    const trailer = new Array(flags.length).fill(false);
                    for (const r of found) {
                        for (let i = r[0]; i <= r[1]; i++) {
                            without[i] = flags[i] && lowerFlags[i];
                            trailer[i] = flags[i] && !lowerFlags[i];
                        }
                    }
                    found = breakRuns(without, step, trailer, brand);
                }
                const firm = solid(without);
                const led = lowerFlags ? showLed(flags, lowerFlags, found, first, step) : [];
                return found.map(r => {
                    // A short piece held to either end by the bridge is given up: the logo hidden for
                    // a moment just after a break, or before one, is a bright scene of the programme
                    // more often than a last advert, and the break would run into it. With a second
                    // logo, pieces with nothing between them that looks like the programme are one:
                    // what parts them is an advert's brand in the channel's corner, or the show's logo
                    // matched for a picture now and then by the notices along the bottom of adverts.
                    const raw = runs(firm.slice(r[0], r[1] + 1), 0);
                    const span = trimmed(lowerFlags ? merged(raw, r[0], flags, lowerFlags) : raw);
                    return [first + (r[0] + span[0]) * step, first + (r[0] + span[1] + 1) * step];
                }).concat(led);
            }

            // From the first picture of held, the pieces of a break, to the last, once a short piece at
            // either end is given up (see logoBreaks); of short pieces only, the first is kept.
            function trimmed(held) {
                let from = 0;
                let to = held.length - 1;
                while (to > from && held[to][1] - held[to][0] + 1 < END_PIECE) to--;
                while (from < to && held[from][1] - held[from][0] + 1 < END_PIECE) from++;
                return [held[from][0], held[to][1]];
            }

            // pieces of a break whose first picture is offset, made one where nothing between them
            // looks like the programme (see programmeIn).
            function merged(pieces, offset, flags, lowerFlags) {
                const out = [];
                for (const p of pieces) {
                    const last = out[out.length - 1];
                    if (last && !programmeIn(offset + last[1] + 1, offset + p[0], flags, lowerFlags)) last[1] = p[1];
                    else out.push([p[0], p[1]]);
                }
                return out;
            }

            // Whether the pictures from from below to look like the programme: one with both logos
            // seen, or the show's seen SOLID pictures in a row.
            function programmeIn(from, to, flags, lowerFlags) {
                let row = 0;
                for (let i = from; i < to; i++) {
                    if (!flags[i] && !lowerFlags[i]) return true;
                    row = lowerFlags[i] ? 0 : row + 1;
                    if (row >= SOLID) return true;
                }
                return false;
            }

            // The breaks a stretch without the second logo gives where found has none (see logoBreaks).
            function showLed(flags, lowerFlags, found, first, step) {
                const firm = solid(flags);
                const clear = (from, to) => {
                    if (from < 0 || to > firm.length) return false;
                    let with_ = 0;
                    for (let i = from; i < to; i++) if (!firm[i]) with_++;
                    return with_ >= CLEAR;
                };
                const out = [];
                for (const r of breakRuns(lowerFlags, step)) {
                    if (found.some(f => f[0] <= r[1] && r[0] <= f[1])) continue;
                    let without = 0;
                    for (let i = r[0]; i <= r[1]; i++) if (flags[i]) without++;
                    if (without < SHOW_LED * (r[1] - r[0] + 1)) continue;
                    let from = -1;
                    let to = -1;
                    for (let i = r[0]; i <= r[1]; i++) {
                        if (!firm[i]) continue;
                        if (from < 0) from = i;
                        to = i + 1;
                    }
                    if (from < 0 || (to - from) * step < MIN_S || !clear(from - AROUND, from) || !clear(to, to + AROUND)) continue;
                    const span = trimmed(merged(runs(firm.slice(r[0], r[1] + 1), 0), r[0], flags, lowerFlags));
                    out.push([first + (r[0] + span[0]) * step, first + (r[0] + span[1] + 1) * step]);
                }
                return out;
            }

            // What captions and logo agree on; either is null when it had nothing to go by.
            function combine(captions, logo) {
                if (captions === null) return logo || [];
                if (logo === null) return captions;
                const out = [];
                for (const spoken of captions) {
                    for (const shown of logo) {
                        const late = Math.max(spoken[0], shown[0]);
                        const early = Math.min(spoken[1], shown[1]);
                        if (early - late < SHARED_S) continue;
                        out.push([
                            Math.abs(spoken[0] - shown[0]) <= EDGE_S ? shown[0] : late,
                            Math.abs(spoken[1] - shown[1]) <= EDGE_S ? shown[1] : early,
                        ]);
                    }
                }
                return out;
            }

            // The corners of a run of pictures, count of them width by height, kept as the strength of
            // their edges. Not every picture need be given: one left out counts as showing the logo.
            function track(count, width, height) {
                const cornerWidth = Math.floor(width * CORNER);
                const cornerHeight = Math.floor(height * CORNER);
                const wide = cornerWidth - 1;
                const high = cornerHeight - 1;
                const size = wide * high;
                const origins = [[0, 0], [width - cornerWidth, 0], [0, height - cornerHeight], [width - cornerWidth, height - cornerHeight]];
                const edges = origins.map(() => new Uint8Array(size > 0 ? count * size : 0));
                const given = new Array(count).fill(false);
                // The corner the logo was found in, kept for what is learnt again once more pictures
                // are given: those wanted next were told from that corner.
                let found = -1;

                // Picture index, as its luma row by row.
                function add(index, luma) {
                    if (size <= 0 || index < 0 || index >= count || luma.length < width * height) return;
                    for (let c = 0; c < origins.length; c++) {
                        const left = origins[c][0];
                        const top = origins[c][1];
                        const out = edges[c];
                        let o = index * size;
                        for (let y = 0; y < high; y++) {
                            let p = (top + y) * width + left;
                            for (let x = 0; x < wide; x++) {
                                const here = luma[p];
                                out[o++] = Math.min(255, Math.abs(luma[p + 1] - here) + Math.abs(luma[p + width] - here));
                                p++;
                            }
                        }
                    }
                    given[index] = true;
                }

                // What stays put in corner c through the pictures read: its points that are a logo,
                // what each mostly is, and how much they stand out. Null when nothing stays.
                function cornerOf(c, read, counts) {
                    const corner = edges[c];
                    const median = new Uint8Array(size);
                    for (let p = 0; p < size; p++) {
                        counts.fill(0);
                        for (const i of read) counts[corner[i * size + p]]++;
                        let below = 0;
                        let value = 0;
                        while (below + counts[value] <= (read.length >> 1)) below += counts[value++];
                        median[p] = value;
                    }
                    const cut = Math.max(1, Array.from(median).sort((a, b) => a - b)[Math.floor(size * MASK)]);
                    const mask = [];
                    let sum = 0;
                    for (let p = 0; p < size; p++) {
                        if (median[p] >= cut) {
                            mask.push(p);
                            sum += median[p];
                        }
                    }
                    return mask.length === 0 ? null : { corner: c, median, mask, strength: sum / mask.length, whole: sum };
                }

                // The strongest of the corners from to below to.
                function strongest(from, to, read, counts) {
                    let kept = null;
                    for (let c = from; c < to; c++) {
                        const one = cornerOf(c, read, counts);
                        if (one !== null && (kept === null || one.strength > kept.strength)) kept = one;
                    }
                    return kept;
                }

                // What each picture read has of the logo kept, and what they mostly have.
                function scored(kept, read) {
                    const corner = edges[kept.corner];
                    const score = new Float64Array(count);
                    const seen = [];
                    for (const i of read) {
                        const o = i * size;
                        let sum = 0;
                        for (const p of kept.mask) sum += Math.min(corner[o + p], kept.median[p]);
                        score[i] = sum / kept.whole;
                        seen.push(score[i]);
                    }
                    seen.sort((a, b) => a - b);
                    kept.score = score;
                    kept.usual = seen[seen.length >> 1];
                    return kept;
                }

                // The logo: the channel's, in an upper corner, when there is one, with the show's own
                // (lower) beside it; a lower corner alone when no upper one holds a logo. With what
                // each picture given has of it. Null when no corner holds anything that stays.
                function learn() {
                    const read = [];
                    for (let i = 0; i < count; i++) if (given[i]) read.push(i);
                    if (size <= 0 || read.length < 2 * AROUND) return null;
                    const counts = new Int32Array(256);
                    const strong = one => one !== null && one.strength >= STRONG ? one : null;
                    const beside = one => one !== null && one.strength >= BESIDE ? one : null;
                    const lower = strongest(UPPER, edges.length, read, counts);
                    const upper = found < 0 ? strong(strongest(0, UPPER, read, counts)) : found < UPPER ? cornerOf(found, read, counts) : null;
                    const kept = upper !== null ? upper : found < 0 ? strong(lower) : cornerOf(found, read, counts);
                    if (kept === null) return null;
                    found = kept.corner;
                    scored(kept, read);
                    kept.lower = upper !== null && beside(lower) !== null ? scored(lower, read) : null;
                    return kept;
                }

                function logoOf(learnt) {
                    const left = origins[learnt.corner][0];
                    const top = origins[learnt.corner][1];
                    return {
                        width,
                        points: learnt.mask.map(m => (top + Math.floor(m / wide)) * width + left + (m % wide)),
                        pattern: learnt.mask.map(m => learnt.median[m]),
                        whole: learnt.whole,
                        usual: learnt.usual,
                        strength: learnt.strength,
                        // A show's own logo, lower down, found beside this one, the channel's.
                        lower: learnt.lower ? logoOf(learnt.lower) : null,
                        // In an upper corner: the channel's, which stays from one programme to the next.
                        channel: learnt.corner < UPPER,
                    };
                }

                // The logo of the pictures given, to look for in others: see score().
                function logo() {
                    const learnt = learn();
                    return learnt === null ? null : logoOf(learnt);
                }

                // Of each picture, whether it was given and is without the logo; null as for logo().
                function flags() {
                    const learnt = learn();
                    return learnt === null ? null : gone(learnt.score, learnt.usual, given);
                }

                return {
                    add,
                    logo,
                    gone: flags,
                    breaks: (first, step) => {
                        const learnt = learn();
                        if (learnt === null) return null;
                        const lowerFlags = learnt.lower ? gone(learnt.lower.score, learnt.lower.usual, given) : null;
                        return logoBreaks(gone(learnt.score, learnt.usual, given), first, step, lowerFlags);
                    },
                };
            }

            // logo without the show's own beside it, which changes with the programme.
            function alone(logo) {
                return logo.lower ? Object.assign({}, logo, { lower: null }) : logo;
            }

            // Whether pictures (luma row by row) show logo often enough, share of them at least, for
            // it to be theirs still.
            function seenIn(logo, pictures, share) {
                let seen = 0;
                for (const luma of pictures) if (score(logo, luma) >= GONE * logo.usual) seen++;
                return seen >= share * pictures.length;
            }

            // How much of a logo the picture of luma has: about logo.usual with it, little without.
            function score(logo, luma) {
                let sum = 0;
                for (let k = 0; k < logo.points.length; k++) {
                    const p = logo.points[k];
                    const here = luma[p];
                    sum += Math.min(Math.abs(luma[p + 1] - here) + Math.abs(luma[p + logo.width] - here), logo.pattern[k]);
                }
                return sum / logo.whole;
            }

            // Whether the SCTE-35 message in an event's text (XML around a base64 section) opens a
            // break (true) or closes one (false); null when it does neither, or cannot be read.
            function opens(text) {
                const candidates = String(text).match(/[A-Za-z0-9+\/]{16,}={0,2}/g) || [];
                for (const candidate of candidates) {
                    let section;
                    try {
                        section = atob(candidate);
                    } catch (e) {
                        continue;
                    }
                    if (section.length < 20 || section.charCodeAt(0) !== 0xFC) continue;
                    const at = i => {
                        if (i < 0 || i >= section.length) throw new RangeError('short');
                        return section.charCodeAt(i);
                    };
                    try {
                        // A splice_insert says by itself whether the network is left.
                        if (at(13) === 5 && (at(18) & 0x80) === 0) return (at(19) & 0x80) !== 0;
                        for (let i = 16; i + 4 <= section.length; i++) {
                            if (section.substr(i, 4) !== 'CUEI' || at(i - 2) !== 2) continue;
                            // A segmentation descriptor, from its cancel indicator on to its type.
                            let q = i + 8;
                            if ((at(q) & 0x80) !== 0) continue;
                            q++;
                            const flags = at(q);
                            q++;
                            if ((flags & 0x80) === 0) q += 1 + 6 * at(q);
                            if ((flags & 0x40) !== 0) q += 5;
                            q += 2 + at(q + 1);
                            const type = at(q);
                            if ([0x22, 0x30, 0x32, 0x34, 0x36].indexOf(type) >= 0) return true;
                            if ([0x23, 0x31, 0x33, 0x35, 0x37].indexOf(type) >= 0) return false;
                        }
                    } catch (e) {
                        return null;
                    }
                    return null;
                }
                return null;
            }

            // The breaks a manifest gives away. stretches: its periods as {start, end or null, marks:
            // [{at, duration or null, opens}], signalled: whether it carries SCTE-35 at all}.
            function markedBreaks(stretches) {
                const raw = [];
                if (stretches.some(s => s.signalled)) {
                    for (const stretch of stretches) {
                        for (const mark of stretch.marks) {
                            if (!mark.opens) continue;
                            // As long as it says; with no length, to the next mark of its period, or its end.
                            let end = null;
                            if (mark.duration !== null) {
                                end = mark.at + mark.duration;
                            } else {
                                const later = stretch.marks.filter(m => m.at > mark.at).map(m => m.at);
                                end = later.length > 0 ? Math.min.apply(null, later) : stretch.end;
                            }
                            if (end !== null && end > mark.at) raw.push([mark.at, end]);
                        }
                    }
                } else {
                    const length = s => s.end - s.start;
                    for (let i = 1; i + 1 < stretches.length; i++) {
                        const before = stretches[i - 1];
                        const jingle = stretches[i];
                        const after = stretches[i + 1];
                        if (before.end === null || jingle.end === null || after.end === null) continue;
                        const shaped = length(jingle) < JINGLE_MAX_S &&
                            length(before) >= HALF_MIN_S && length(before) <= HALF_MAX_S &&
                            length(after) >= HALF_MIN_S && length(after) <= HALF_MAX_S;
                        if (shaped) raw.push([before.start, after.end]);
                    }
                    // A break in one piece, as RMC Story's in the morning: one to seven minutes between
                    // two longer stretches, the one after it maybe still on air. Only on a stream that
                    // shows it cuts itself at its breaks, by one of the shape above: one cut at its
                    // programmes would lose a short one.
                    if (raw.length > 0) {
                        for (let i = 1; i + 1 < stretches.length; i++) {
                            const before = stretches[i - 1];
                            const block = stretches[i];
                            const after = stretches[i + 1];
                            if (before.end === null || block.end === null) continue;
                            const single = length(block) >= HALF_MIN_S && length(block) <= HALF_MAX_S &&
                                length(before) > HALF_MAX_S && (after.end === null || length(after) > HALF_MAX_S);
                            if (single) raw.push([block.start, block.end]);
                        }
                    }
                }
                return merge(raw, MERGE_GAP_S);
            }

            // Breaks in order, those no more than gap apart as one.
            function merge(breaks, gap) {
                const out = [];
                for (const b of breaks.slice().sort((x, y) => x[0] - y[0])) {
                    const last = out[out.length - 1];
                    if (last && b[0] - last[1] <= gap) last[1] = Math.max(last[1], b[1]);
                    else out.push([b[0], b[1]]);
                }
                return out;
            }

            // M6 and Gulli put 0.48 s of black between two adverts, which the size of the frames gives
            // away though the pictures are encrypted: at 270 lines, a dozen frames of 32 to 36 bytes (now
            // and then up to 20), then a key frame of several kilobytes where the next advert starts. A
            // held picture in a cartoon looks alike but its frames are mostly bigger, and comes alone or
            // a few within a minute. So a black is BLACK_MIN to BLACK_MAX frames under `tiny` bytes, `mean` at most on
            // average, then one over `key`, as BLACKS has them for the rendition's height: the same
            // blacks are in the higher renditions, in bigger frames, and each rendition misses some that
            // another finds, so three are read and a black any of them finds counts once (SEP_SAME_S);
            // 432 lines found blacks in cartoons. A break is SEP_LEAST of them over SEP_SPAN_S or more,
            // none more than SEP_GAP_S from the next, or SEP_WIDE_GAP_S between two runs of SEP_PART or
            // more (a black missed, a few bytes over, leaves two adverts between two: 95 s seen), and so
            // across a run of one or two between them, each side as far (a card in the break, M6's
            // "Publicité" among trailers or Gulli's sponsor, has no black; but not a cartoon's last
            // black or two before a break), and runs from the second to the one before the last, which
            // one stray black in the programme around it leaves in the adverts. As the etincelle apps'
            // Separators.
            const BLACKS = {
                270: { tiny: 120, mean: 40, key: 4000 },
                540: { tiny: 172, mean: 86, key: 8000 },
                1080: { tiny: 430, mean: 172, key: 12000 },
            };
            const BLACK_MIN = 10;
            const BLACK_MAX = 20;
            const SEP_SAME_S = 0.2;
            const SEP_LEAST = 6;
            const SEP_SPAN_S = 90;
            const SEP_GAP_S = 60;
            const SEP_WIDE_GAP_S = 100;
            const SEP_PART = 3;
            // The most bytes a segment's header is read to, and the most frames it may list.
            const MOOF_MAX = 65536;
            const MOST_FRAMES = 10000;

            function boxType(d, at) {
                return String.fromCharCode(d[at + 4], d[at + 5], d[at + 6], d[at + 7]);
            }

            // Where the first moof of a segment whose first bytes are d (a Uint8Array) ends, which may
            // be past them; null when they do not reach its header.
            function moofEnd(d) {
                const v = new DataView(d.buffer, d.byteOffset, d.byteLength);
                let a = 0;
                while (d.length - a >= 8) {
                    const size = v.getUint32(a);
                    if (size < 8 || a + size > MOOF_MAX) return null;
                    if (boxType(d, a) === 'moof') return a + size;
                    a += size;
                }
                return null;
            }

            // The whole boxes from `from` to `to`: their type and where their content is.
            function boxesIn(d, v, from, to) {
                const out = [];
                let a = from;
                while (to - a >= 8) {
                    const size = v.getUint32(a);
                    if (size < 8 || size > to - a) break;
                    out.push({ type: boxType(d, a), from: a + 8, to: a + size });
                    a += size;
                }
                return out;
            }

            // The sizes of the frames of a segment whose first bytes are d, from its first moof; null
            // when d does not hold all of it, or it cannot be read.
            function frameSizes(d) {
                const end = moofEnd(d);
                if (end === null || end > d.length) return null;
                const v = new DataView(d.buffer, d.byteOffset, d.byteLength);
                const moof = boxesIn(d, v, 0, end).pop();
                if (!moof || moof.type !== 'moof') return null;
                const traf = boxesIn(d, v, moof.from, moof.to).filter(b => b.type === 'traf')[0];
                if (!traf) return null;
                const out = [];
                let fallback = -1;
                for (const box of boxesIn(d, v, traf.from, traf.to)) {
                    if (box.type !== 'tfhd' && box.type !== 'trun') continue;
                    const a = box.from;
                    if (box.to - a < 8) return null;
                    const flags = v.getUint32(a) & 0xFFFFFF;
                    if (box.type === 'tfhd') {
                        // After the track: a base offset, a description index, a frame length, the size.
                        let p = a + 8;
                        if (flags & 0x01) p += 8;
                        if (flags & 0x02) p += 4;
                        if (flags & 0x08) p += 4;
                        if (flags & 0x10) {
                            if (p + 4 > box.to) return null;
                            fallback = v.getUint32(p);
                        }
                    } else {
                        const count = v.getUint32(a + 4);
                        // Each frame has a length, a size, flags and an offset, each when the flags say so.
                        const each = ((flags & 0x100 ? 1 : 0) + (flags & 0x200 ? 1 : 0) + (flags & 0x400 ? 1 : 0) + (flags & 0x800 ? 1 : 0)) * 4;
                        let p = a + 8 + (flags & 0x01 ? 4 : 0) + (flags & 0x04 ? 4 : 0);
                        if (count > MOST_FRAMES || p + count * each > box.to) return null;
                        if (!(flags & 0x200) && fallback < 0) return null;
                        for (let i = 0; i < count; i++) {
                            out.push(flags & 0x200 ? v.getUint32(p + (flags & 0x100 ? 4 : 0)) : fallback);
                            p += each;
                        }
                    }
                }
                return out;
            }

            // Where the blacks in a segment end, the next advert starting: sizes are its frames', the
            // first at start (s), each frame s long, in a rendition where a black is `black` (one of
            // BLACKS).
            function separatorEnds(sizes, start, frame, black) {
                const out = [];
                let tiny = 0;
                let bytes = 0;
                for (let i = 0; i < sizes.length; i++) {
                    const size = sizes[i];
                    if (size >= 0 && size < black.tiny) {
                        tiny++;
                        bytes += size;
                        continue;
                    }
                    if (tiny >= BLACK_MIN && tiny <= BLACK_MAX && bytes <= black.mean * tiny && size > black.key) out.push(start + i * frame);
                    tiny = 0;
                    bytes = 0;
                }
                return out;
            }

            // The breaks the blacks ending at `ends` (s) make, in order, as [start, end]; one found in
            // several renditions counts once.
            function separatedBreaks(ends) {
                const runs = [];
                for (const end of ends.slice().sort((x, y) => x - y)) {
                    const last = runs[runs.length - 1];
                    if (last && end - last[last.length - 1] <= SEP_SAME_S) continue;
                    if (last && end - last[last.length - 1] <= SEP_GAP_S) last.push(end);
                    else runs.push([end]);
                }
                const joined = [];
                for (let i = 0; i < runs.length; i++) {
                    const run = runs[i];
                    const next = runs[i + 1];
                    let last = joined[joined.length - 1];
                    if (last && !(last.length >= SEP_PART && run[0] - last[last.length - 1] <= SEP_WIDE_GAP_S)) last = null;
                    if (last && run.length >= SEP_PART) last.push(...run);
                    else if (last && next && next.length >= SEP_PART && next[0] - run[run.length - 1] <= SEP_WIDE_GAP_S) {
                        last.push(...run, ...next);
                        i++;
                    } else joined.push(run);
                }
                return joined.filter(r => r.length >= SEP_LEAST && r[r.length - 1] - r[0] >= SEP_SPAN_S).map(r => [r[1], r[r.length - 2]]);
            }

            // The logo break `b` [start, end], where one of the `separated` begun before its end is the
            // same break, whose end is in the adverts: to that end when further. As the etincelle
            // apps' AdBreaks.liveEnd.
            function reachSeparated(b, separated) {
                const same = separated.filter(s => s[0] < b[1] && s[1] > b[1])[0];
                return same ? [b[0], same[1]] : b;
            }

            // Where a skip in the break s by the blacks between its adverts goes: on to where one of the
            // logo's breaks, guesses, that it lies in is taken to end, when later, as the cards and
            // trailers after the last advert go too. As the etincelle apps' AdBreaks.askedEnd.
            function askedEnd(s, guesses) {
                return guesses.filter(g => g[0] < s[1] && g[1] > s[1]).reduce((end, g) => Math.max(end, g[1]), s[1]);
            }

            return { runs, captionBreaks, gone, solid, logoBreaks, combine, track, score, alone, seenIn, opens, markedBreaks, merge, moofEnd, frameSizes, separatorEnds, separatedBreaks, reachSeparated, askedEnd, BLACKS, SEP_WIDE_GAP_S, BRIDGE, AROUND, LOGO_MAX_S };
        })();
        // </ad-rule>

        // <ad-skip>
        // What reads a stream for its breaks and offers the one playback is in. Nothing here may stop
        // playback: every step is guarded, and what cannot be read is no break. It knows of the player
        // only what env gives, so that another player can use it as it is (the Home Assistant
        // integration's panel carries a copy of this block, and of the rules above):
        // - isLive(), joining(): whether the stream is live, and still joining its live point;
        // - state(): 'playing', 'paused' or anything else;
        // - currentTime(), liveRange(): where playback is and the live window ({start, end}), in media
        //   time (s); absoluteTime(media) and mediaTime(absolute) convert to and from seconds since 1970;
        // - show(on): offers the skip or takes it back, and says whether it is offered;
        // - seek(media): goes there.
        function makeAdSkip(env) {

            // A live channel's pictures come one every four seconds, by their time since 1970.
            const STEP_S = 4;
            const NOT_YET_S = 12;
            const BEHIND_S = 60;
            const LIVE_MARGIN_S = 2;
            const LAST_MOMENT_S = 1;
            // A guessed break is taken to end this long before the logo is back: channels put their
            // logo up again as much as half a minute after the programme, and skipping to it would
            // cut that much of the show. The last adverts are left in instead.
            const GUESS_EARLY_S = 32;
            // The logo is learnt from a picture every LEARN_EVERY_S, this far on each side of the
            // playhead, again once the playhead is LEARN_AGAIN_S from there, or LEARN_RETRY_S when
            // nothing was learnt.
            const LEARN_SPAN_S = 1200;
            const LEARN_EVERY_S = 28;
            const LEARN_AGAIN_S = 900;
            const LEARN_RETRY_S = 120;
            // Where no logo stands out, the channel's last one is taken when seen on this share of the
            // pictures; with none, it is looked for this many times forty minutes back, once.
            const KEPT_SEEN = 0.4;
            const EARLIER_TIMES = 3;
            // Read around the playhead at all times, and more at a time while a stretch without the
            // logo goes on, for as far as a break may; older pictures are forgotten.
            const BACK_S = 64;
            const AHEAD_S = 88;
            const MORE_S = 120;
            const MORE_TIMES = 4;
            const FAR_S = AdRule.LOGO_MAX_S + 160;
            // Older pictures are forgotten, no nearer than a read back may reach, or they would be
            // read again at each look.
            const KEPT_S = FAR_S + MORE_S;
            const TRIES = 3;
            // A channel's blacks between adverts (see AdRule.separatorEnds) are read from the first
            // bytes of each segment, its header (2609 bytes in every rendition of these channels in
            // November 2026; more is read when it is longer), this far on each side of the playhead:
            // further than a break lasts, so that one the playhead is in is known from end to end.
            const HEAD_BYTES = 4096;
            // A browser that refuses to read part of a segment, as a Chromecast's does with these
            // (the Range header has it ask the server first, which does not allow it), reads the
            // lowest rendition's segments whole instead, a few at a time: some 135 MB an hour.
            const WHOLE_HEIGHT = Math.min.apply(null, Object.keys(AdRule.BLACKS).map(Number));
            const AT_ONCE = 6;
            const WHOLE_AT_ONCE = 2;
            const SEPARATED_FAR_S = 480;
            // Segments are read up to this close to the live point, and none that starts closer than
            // SEGMENT_FRESH_S to where the newest one ends by now (the newest of the list, which is
            // read again only every MARKED_EVERY_MS, plus the time since): a Chromecast's live point
            // is some 13 s behind that, a browser player's can be on it, and a segment is not always
            // readable the moment it is listed.
            const SEGMENT_NOT_YET_S = 1;
            const SEGMENT_FRESH_S = 8;
            // A segment still refused after TRIES looks is asked for again this much later, and twice
            // as long after each of the SEGMENT_LATER tries that fail: the service refuses one
            // rendition of a small channel now and then for some minutes (Toute l'Histoire, Automoto
            // and AB 1 in November 2026), and answers again after. What it goes on refusing is let be,
            // rather than asked for every minute while in reach.
            const SEGMENT_AGAIN_S = 60;
            const SEGMENT_LATER = 4;
            const MARKED_EVERY_MS = 30000;
            const LOOK_EVERY_MS = 4000;
            // A recording has no more strips of thumbnails, nor caption segments.
            const MAX_STRIPS = 150;
            const MAX_SEGMENTS = 10000;
            // A recording that could not be read is searched again after this long while it plays.
            const RECORDING_RETRY_MS = 5 * 60 * 1000;
            // A recording's blacks between its adverts are told only when all but one in this many of
            // the segments read for them could be read: one that cannot be read could hide a black.
            const RECORDING_MISSED_IN = 10;
            // What is asked of the network and does not come is given up on after this long.
            const TIMEOUT_MS = 20000;
            // Pictures are read at half their size, which the logo survives.
            const PICTURE_WIDTH = 240;
            const PICTURE_HEIGHT = 135;

            // What is being played; a search that outlives it finds itself out of date by its number.
            let playing = 0;
            let key = null;
            let live = false;
            let manifestUrl = null;
            let thumbnailsUrl = null;
            // A recording's breaks, as [start, end] in its own time, by its pictures and captions, and by
            // the blacks between its adverts within those; the search's outcome for the status; and the
            // search still to be made, once the recording plays.
            let recorded = [];
            let recordedSeparated = [];
            let recordedState = 'none';
            let wanted = null;
            // The searches of the recording loaded that failed, for each to wait twice as long as the one before.
            let recordingFails = 0;
            const known = new Map();
            // A live channel's: marked by its manifest and found by its logo, in seconds since 1970.
            let marked = [];
            let markedAt = 0;
            let markedState = 'none';
            let found = [];
            let logo = null;
            let logoState = 'none';
            let learntAt = -Infinity;
            // The learns in a row that found no logo.
            let failures = 0;
            // The channel's logo last found, by the address of its pictures, for a channel played again
            // while this page lives: what a learn over pictures mostly of adverts and trailers falls back
            // on; and the channel whose earlier pictures were last searched for it, once a stream.
            const remembered = new Map();
            let searchedFor = null;
            let scores = new Map();
            // The same of the show's own logo, when one was learnt beside the channel's.
            let lowerScores = new Map();
            let missed = new Map();
            // The stream a look is under way for; 0 when none is.
            let looking = 0;
            let lookedAt = 0;
            // Where the skip on offer leads, in media time; null when none is. And whether it is shown.
            let offered = null;
            let shown = false;
            let canvas = null;
            // The blacks between adverts, on a channel that has them as the sender says
            // (separated_breaks): the live video segments the manifest last listed, the blacks found in
            // each segment read by its key (its rendition's height and its time) with its time (s since
            // 1970), those that could not be read with how many times, and the breaks they make. For the
            // status: how many reads failed, and why the last one did. Whether segments are read whole.
            let separating = false;
            let separatorsState = 'none';
            let videoSegments = [];
            let videoSegmentsAt = 0;
            let blacks = new Map();
            let blackMisses = new Map();
            let separated = [];
            let readFailures = 0;
            let readFailure = '';
            let whole = false;

            function pathOf(url) {
                const q = String(url).indexOf('?');
                return q < 0 ? String(url) : String(url).slice(0, q);
            }

            // A stream was loaded: what was known of another is dropped, and a recording is searched.
            function load(media, customData) {
                try {
                    const url = media && media.contentId;
                    const nowLive = !!env.isLive();
                    const newKey = url ? pathOf(url) : null;
                    manifestUrl = url || null;
                    const thumbs = customData && customData.live_thumbnails_url;
                    thumbnailsUrl = (nowLive && typeof thumbs === 'string' && thumbs.indexOf('https://') === 0) ? thumbs.replace(/\/+$/, '') : null;
                    separating = nowLive && !!(customData && customData.separated_breaks === true);
                    // Only what the sender says is a recording is searched: a replay has no adverts.
                    const record = !nowLive && !!(customData && customData.recording) && newKey !== null;
                    // The same stream loaded again, as after a break in the connection: all is kept,
                    // but a search that failed is made again.
                    if (newKey !== null && newKey === key && nowLive === live) {
                        if (record && /^error/.test(recordedState)) wanted = { url: manifestUrl, name: key, mine: playing };
                        return;
                    }
                    playing++;
                    key = newKey;
                    live = nowLive;
                    offered = null;
                    shown = env.show(false);
                    recorded = [];
                    recordedSeparated = [];
                    recordedState = record ? 'waiting' : 'none';
                    marked = [];
                    markedAt = 0;
                    markedState = 'none';
                    found = [];
                    logo = null;
                    logoState = 'none';
                    learntAt = -Infinity;
                    failures = 0;
                    searchedFor = null;
                    scores = new Map();
                    lowerScores = new Map();
                    missed = new Map();
                    separatorsState = separating ? 'waiting' : 'none';
                    videoSegments = [];
                    videoSegmentsAt = 0;
                    blacks = new Map();
                    blackMisses = new Map();
                    separated = [];
                    readFailures = 0;
                    readFailure = '';
                    whole = false;
                    // Once it plays (see tick): its start is not to be slowed by the search.
                    wanted = record ? { url: manifestUrl, name: key, mine: playing } : null;
                    recordingFails = 0;
                } catch (e) {
                    recordedState = 'error';
                }
            }

            // Runs work on each item, atOnce at a time; resolves with what each gave, in order.
            function each(items, atOnce, work) {
                const out = new Array(items.length);
                let next = 0;
                const worker = async () => {
                    while (next < items.length) {
                        const i = next++;
                        out[i] = await work(items[i], i);
                    }
                };
                const workers = [];
                for (let w = 0; w < Math.min(atOnce, items.length); w++) workers.push(worker());
                return Promise.all(workers).then(() => out);
            }

            async function text(url) {
                const abort = new AbortController();
                const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
                try {
                    const response = await fetch(url, { credentials: 'omit', signal: abort.signal });
                    if (!response.ok) throw new Error('http ' + response.status);
                    return await response.text();
                } finally {
                    clearTimeout(timer);
                }
            }

            // The image at url drawn width by height, as its pixels (RGBA); null when it cannot be had.
            function pixels(url, width, height) {
                return new Promise(resolve => {
                    const image = new Image();
                    const timer = setTimeout(() => {
                        image.onload = null;
                        image.onerror = null;
                        resolve(null);
                    }, TIMEOUT_MS);
                    image.crossOrigin = 'anonymous';
                    image.onload = () => {
                        clearTimeout(timer);
                        try {
                            if (canvas === null) canvas = document.createElement('canvas');
                            if (canvas.width !== width || canvas.height !== height) {
                                canvas.width = width;
                                canvas.height = height;
                            }
                            const context2d = canvas.getContext('2d', { willReadFrequently: true });
                            context2d.drawImage(image, 0, 0, width, height);
                            resolve(context2d.getImageData(0, 0, width, height).data);
                        } catch (e) {
                            resolve(null);
                        }
                    };
                    image.onerror = () => {
                        clearTimeout(timer);
                        resolve(null);
                    };
                    image.src = url;
                });
            }

            // The luma of the picture at left of a row of pixels rowWidth wide.
            function lumaOf(data, rowWidth, left) {
                const out = new Uint8Array(PICTURE_WIDTH * PICTURE_HEIGHT);
                let o = 0;
                for (let y = 0; y < PICTURE_HEIGHT; y++) {
                    let p = (y * rowWidth + left) * 4;
                    for (let x = 0; x < PICTURE_WIDTH; x++) {
                        out[o++] = (data[p] * 77 + data[p + 1] * 150 + data[p + 2] * 29) >> 8;
                        p += 4;
                    }
                }
                return out;
            }

            function seconds(duration) {
                const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(duration || '');
                return m ? (Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)) : NaN;
            }

            function children(node, name) {
                const out = [];
                for (let c = node.firstElementChild; c; c = c.nextElementSibling) if (c.localName === name) out.push(c);
                return out;
            }

            function baseOf(node, base) {
                const own = children(node, 'BaseURL')[0];
                return own && own.textContent ? new URL(own.textContent.trim(), base).href : base;
            }

            // The segments of an adaptation set of a recording total seconds long, as {time, duration,
            // url}; empty when they cannot be told.
            function segmentsOf(set, base, total, chosen) {
                const representation = chosen || children(set, 'Representation')[0];
                if (!representation) return [];
                const template = children(set, 'SegmentTemplate')[0] || children(representation, 'SegmentTemplate')[0];
                const media = template && template.getAttribute('media');
                if (!media) return [];
                const scale = Number(template.getAttribute('timescale') || 1);
                const offset = Number(template.getAttribute('presentationTimeOffset') || 0);
                // $Time$ or $Number$, which may ask for a width, as $Number%05d$.
                const put = (template_, name, value) => template_.replace(new RegExp('\\$' + name + '(?:%0(\\d+)d)?\\$', 'g'),
                    (whole, width) => (width ? String(value).padStart(Number(width), '0') : String(value)));
                const address = (time, number) => new URL(
                    put(put(media.split('$RepresentationID$').join(representation.getAttribute('id')), 'Time', time), 'Number', number), base).href;
                const out = [];
                const timeline = children(template, 'SegmentTimeline')[0];
                if (timeline) {
                    let time = 0;
                    let number = Number(template.getAttribute('startNumber') || 1);
                    const entries = children(timeline, 'S');
                    for (let e = 0; e < entries.length; e++) {
                        const s = entries[e];
                        if (s.getAttribute('t') !== null) time = Number(s.getAttribute('t'));
                        const length = Number(s.getAttribute('d'));
                        let repeat = Number(s.getAttribute('r') || 0);
                        if (!(length > 0)) return [];
                        if (repeat < 0) {
                            // Repeated to the next entry, or to the end of the recording.
                            const next = e + 1 < entries.length ? entries[e + 1].getAttribute('t') : null;
                            const until = next !== null ? Number(next) : total * scale + offset;
                            repeat = Math.ceil((until - time) / length) - 1;
                        }
                        if (!(repeat >= 0)) return [];
                        for (let k = 0; k <= repeat; k++) {
                            out.push({ time: (time - offset) / scale, duration: length / scale, url: address(time, number) });
                            time += length;
                            number++;
                            if (out.length > MAX_SEGMENTS) return [];
                        }
                    }
                    return out;
                }
                // Numbered: the first may begin before the recording does, by what the manifest says
                // (eptDelta), or by its number and the track's offset.
                const length = Number(template.getAttribute('duration')) / scale;
                const first = Number(template.getAttribute('startNumber') || 1);
                if (!(length > 0)) return [];
                let early = 0;
                if (template.getAttribute('eptDelta') !== null) {
                    early = Number(template.getAttribute('eptDelta')) / scale;
                } else {
                    early = (first - 1) * length - offset / scale;
                }
                if (!(early < 0 && -early < length)) early = 0;
                const last = template.getAttribute('endNumber') !== null
                    ? Number(template.getAttribute('endNumber')) : first + Math.ceil((total - early) / length) - 1;
                if (!(last >= first) || last - first + 1 > MAX_SEGMENTS) return [];
                for (let n = first; n <= last; n++) {
                    out.push({ time: (n - first) * length + early, duration: length, url: address('', n) });
                }
                return out;
            }

            // The breaks the captions of a recording give away; null when they say nothing. Throws
            // when too many could not be read.
            async function captionsOf(segments, mine) {
                if (segments.length === 0) return null;
                const paragraph = /<p\b[^>]*>([\s\S]*?)<\/p>/g;
                let unread = 0;
                const spoken = await each(segments, 4, async segment => {
                    // Another stream was loaded meanwhile: nothing more is asked for this one.
                    if (mine !== playing) return true;
                    try {
                        // Asked twice: one that fails for a moment would have the whole search made again.
                        const body = await text(segment.url).catch(() => text(segment.url));
                        let m;
                        paragraph.lastIndex = 0;
                        while ((m = paragraph.exec(body)) !== null) {
                            if (m[1].replace(/<[^>]+>/g, '').trim() !== '') return true;
                        }
                        return false;
                    } catch (e) {
                        unread++;
                        // One that could not be read counts as spoken: it can hide a break, not make one.
                        return true;
                    }
                });
                if (mine !== playing) throw new Error('superseded');
                if (unread * 20 > spoken.length) throw new Error('captions unread');
                return AdRule.captionBreaks(spoken, segments[0].time, segments[0].duration);
            }

            // The breaks the logo of a recording gives away, from its strips of across by down
            // thumbnails; null when it has none. Throws when a strip wanted could not be read.
            async function logoOf(strips, across, down, mine) {
                // A strip is a single row of pictures on this service; another layout is left alone.
                if (strips.length === 0 || strips.length > MAX_STRIPS || down !== 1 || !(across > 0)) return null;
                const perStrip = across;
                const track = AdRule.track(strips.length * perStrip, PICTURE_WIDTH, PICTURE_HEIGHT);
                const give = async wanted => {
                    const read = await each(wanted, 1, async i => {
                        if (mine !== playing) return false;
                        // Asked twice, as the captions.
                        let data = await pixels(strips[i].url, across * PICTURE_WIDTH, PICTURE_HEIGHT);
                        if (data === null && mine === playing) data = await pixels(strips[i].url, across * PICTURE_WIDTH, PICTURE_HEIGHT);
                        if (data === null) return false;
                        for (let k = 0; k < perStrip; k++) {
                            track.add(i * perStrip + k, lumaOf(data, across * PICTURE_WIDTH, k * PICTURE_WIDTH));
                        }
                        return true;
                    });
                    return read.every(ok => ok);
                };
                const indices = strips.map((s, i) => i);
                // Every other strip first, then those next to one with the logo gone.
                if (!await give(indices.filter(i => i % 2 === 0))) throw new Error('thumbnails unread');
                const without = track.gone();
                if (without === null) return null;
                const suspect = strip => {
                    if (strip < 0 || strip >= strips.length) return false;
                    for (let i = strip * perStrip; i < (strip + 1) * perStrip; i++) if (without[i]) return true;
                    return false;
                };
                if (!await give(indices.filter(i => i % 2 === 1 && (suspect(i - 1) || suspect(i + 1))))) throw new Error('thumbnails unread');
                return track.breaks(strips[0].time, strips[0].duration / perStrip);
            }

            async function searchRecording(url, name, mine) {
                if (known.has(name)) {
                    const was = known.get(name);
                    recorded = was.breaks;
                    recordedSeparated = was.separated || [];
                    recordedState = 'known';
                    // Its blacks, when they could not be read or their search was cut short: read again.
                    if (was.separated === null) await separate(was, mine);
                    return;
                }
                recordedState = 'searching';
                try {
                    const mpd = new DOMParser().parseFromString(await text(url), 'application/xml').documentElement;
                    const periods = mpd ? children(mpd, 'Period') : [];
                    const total = mpd ? seconds(mpd.getAttribute('mediaPresentationDuration')) : NaN;
                    // One still being made, of no length yet, is searched again once it is whole: what is found is kept.
                    if (mpd && (mpd.getAttribute('type') === 'dynamic' || !(total > 0))) throw new Error('not whole yet');
                    if (!mpd || periods.length !== 1) {
                        if (mine === playing) recordedState = 'not a recording';
                        return;
                    }
                    const base = baseOf(periods[0], baseOf(mpd, url));
                    let captions = null;
                    let logoBreaks = null;
                    for (const set of children(periods[0], 'AdaptationSet')) {
                        const representation = children(set, 'Representation')[0];
                        const mime = set.getAttribute('mimeType') || (representation && representation.getAttribute('mimeType')) || '';
                        const kind = set.getAttribute('contentType') || mime.split('/')[0];
                        if (kind === 'text' && captions === null) {
                            captions = await captionsOf(segmentsOf(set, base, total), mine);
                        } else if (kind === 'image' && logoBreaks === null) {
                            const tiles = children(set, 'EssentialProperty').concat(representation ? children(representation, 'EssentialProperty') : [])
                                .filter(p => /thumbnail_tile$/.test(p.getAttribute('schemeIdUri') || ''))[0];
                            const layout = /^(\d+)x(\d+)$/.exec(tiles ? (tiles.getAttribute('value') || '') : '');
                            if (layout) logoBreaks = await logoOf(segmentsOf(set, base, total), Number(layout[1]), Number(layout[2]), mine);
                        }
                        if (mine !== playing) return;
                    }
                    const breaks = AdRule.combine(captions, logoBreaks).filter(b => b[0] > 0 && b[1] < total);
                    const found = { breaks, separated: null, period: periods[0], base, total };
                    known.set(name, found);
                    if (known.size > 20) known.delete(known.keys().next().value);
                    if (mine !== playing) return;
                    recorded = breaks;
                    recordedState = 'found ' + breaks.length + ' (captions ' + (captions === null ? 'none' : captions.length) +
                        ', logo ' + (logoBreaks === null ? 'none' : logoBreaks.length) + ')';
                    // Then the blacks between the adverts, read about those breaks only.
                    await separate(found, mine);
                } catch (e) {
                    // Not remembered: asked again a while later while it plays, less and less often, as the
                    // next time it is loaded.
                    if (mine === playing) {
                        recordedState = 'error: ' + String(e && e.message).slice(0, 40);
                        setTimeout(() => {
                            if (mine === playing && /^error/.test(recordedState)) wanted = { url, name, mine };
                        // No further apart than some two weeks: a timer reads its delay as 32 bits.
                        }, RECORDING_RETRY_MS * 2 ** Math.min(recordingFails++, 12));
                    }
                }
            }

            // The blacks between the adverts of a recording, about the breaks known has of it (found): kept
            // once read, left to be read again at its next load when they could not be.
            async function separate(found, mine) {
                if (found.breaks.length === 0) {
                    found.separated = [];
                    return;
                }
                const separated = await recordingBlacks(found.period, found.base, found.total, found.breaks, mine);
                if (separated === null) return;
                found.separated = separated;
                if (mine === playing) recordedSeparated = separated;
            }

            // The breaks the blacks between the adverts of a recording give within its breaks guessed from
            // the pictures and captions (only those count: blacks in a programme, on a channel with none
            // between its adverts, make none), by place in it; null when too many could not be read to
            // tell. Read about those breaks only, from the lowest rendition of each height AdRule.BLACKS
            // lists, or from the whole segments of the lowest where part of one cannot be read.
            async function recordingBlacks(period, base, total, guessed, mine) {
                const segments = [];
                lowestVideo(period).forEach((of, height) => {
                    for (const s of segmentsOf(of.set, baseOf(of.rep, baseOf(of.set, base)), total, of.rep)) {
                        segments.push({ time: s.time, duration: s.duration, url: s.url, height });
                    }
                });
                // What was read of each, by its place there: where its blacks end, or why it could not be read.
                const read = new Map();
                // As far beyond each break as a run of blacks reaches, so that one across its edge is read
                // whole, then further while one is found near an edge (see widened).
                const reach = AdRule.SEP_WIDE_GAP_S;
                let places = guessed.map(b => [Math.max(0, b[0] - reach), Math.min(total, b[1] + reach)]);
                const ends = () => {
                    const out = [];
                    read.forEach(g => { if (typeof g !== 'string') out.push(...g); });
                    return out;
                };
                for (;;) {
                    let todo = [];
                    segments.forEach((s, i) => {
                        if (!read.has(i) && (!whole || s.height === WHOLE_HEIGHT) && places.some(p => s.time + s.duration > p[0] && s.time < p[1])) todo.push(i);
                    });
                    for (let round = 0; round < TRIES && todo.length > 0; round++) {
                        const got = await each(todo, whole ? WHOLE_AT_ONCE : AT_ONCE, i => (mine === playing ? blacksOf(segments[i]) : 'stopped'));
                        if (mine !== playing) return null;
                        const refused = await partRefused(todo.map(i => segments[i]), got);
                        if (mine !== playing) return null;
                        if (refused) {
                            whole = true;
                            todo = todo.filter(i => segments[i].height === WHOLE_HEIGHT);
                            round = -1;
                            continue;
                        }
                        todo.forEach((i, k) => read.set(i, got[k]));
                        todo = todo.filter((i, k) => typeof got[k] === 'string');
                    }
                    const wider = widened(places, ends(), total);
                    if (wider.every((p, k) => p[0] === places[k][0] && p[1] === places[k][1])) break;
                    places = wider;
                }
                const counted = Array.from(read.entries()).filter(([i]) => !whole || segments[i].height === WHOLE_HEIGHT);
                if (counted.length === 0) return null;
                const failed = counted.filter(([, g]) => typeof g === 'string').length;
                const found = ends();
                separatorsState = 'segments ' + counted.length + (whole ? ' whole ' + WHOLE_HEIGHT + 'p' : '') + ', blacks ' + found.length +
                    (failed > 0 ? ', failed ' + failed : '');
                if (failed * RECORDING_MISSED_IN > counted.length) return null;
                const within = AdRule.separatedBreaks(found).filter(s => guessed.some(b => b[0] <= s[0] && s[1] <= b[1]));
                separatorsState += ', breaks ' + within.length;
                return within;
            }

            // The stretches of a recording total seconds long read for their blacks, places, once those
            // ends are known: each edge with a black nearer than a run of blacks reaches goes that much
            // further, as the run may go on past it. A run cut short by an edge could end a break on a
            // black of the programme after it, where reading the whole recording finds it ends outside
            // the guessed break, and leaves it out.
            function widened(places, ends, total) {
                const reach = AdRule.SEP_WIDE_GAP_S;
                const near = edge => ends.some(e => e > edge - reach && e < edge + reach);
                return places.map(p => [p[0] > 0 && near(p[0]) ? Math.max(0, p[0] - reach) : p[0], p[1] < total && near(p[1]) ? Math.min(total, p[1] + reach) : p[1]]);
            }

            // The breaks a live manifest marks, in seconds since 1970, which is where its times start.
            async function readMarked(mine) {
                try {
                    const mpd = new DOMParser().parseFromString(await text(manifestUrl), 'application/xml').documentElement;
                    if (!mpd || mine !== playing) return;
                    const zero = Date.parse(mpd.getAttribute('availabilityStartTime') || '') / 1000;
                    if (!isFinite(zero)) {
                        markedState = 'no start time';
                        return;
                    }
                    const periods = children(mpd, 'Period');
                    const starts = periods.map(p => seconds(p.getAttribute('start')));
                    let previous = null;
                    const stretches = periods.map((period, i) => {
                        // A period that does not say where it starts follows the one before.
                        const start = isFinite(starts[i]) ? zero + starts[i] : (previous !== null ? previous : zero);
                        const length = seconds(period.getAttribute('duration'));
                        const end = isFinite(length) ? start + length : (i + 1 < starts.length && isFinite(starts[i + 1]) ? zero + starts[i + 1] : null);
                        const streams = children(period, 'EventStream').filter(s => (s.getAttribute('schemeIdUri') || '').indexOf('urn:scte:scte35') === 0);
                        const marks = [];
                        for (const stream of streams) {
                            const scale = Number(stream.getAttribute('timescale') || 1);
                            const from = Number(stream.getAttribute('presentationTimeOffset') || 0);
                            for (const event of children(stream, 'Event')) {
                                const opens = AdRule.opens(new XMLSerializer().serializeToString(event));
                                if (opens === null) continue;
                                const length_ = Number(event.getAttribute('duration') || 0) / scale;
                                marks.push({ at: start + (Number(event.getAttribute('presentationTime') || 0) - from) / scale, duration: length_ > 0 ? length_ : null, opens });
                            }
                        }
                        previous = end;
                        return { start, end, marks, signalled: streams.length > 0 };
                    });
                    marked = AdRule.markedBreaks(stretches);
                    markedState = 'periods ' + periods.length + ', breaks ' + marked.length;
                    if (separating) {
                        videoSegments = videoSegmentsOf(mpd, zero);
                        videoSegmentsAt = Date.now() / 1000;
                    }
                } catch (e) {
                    if (mine === playing) markedState = 'error: ' + String(e && e.message).slice(0, 40);
                }
            }

            // The segments of the video renditions of a live manifest that AdRule.BLACKS lists, the
            // lowest of each height there, as {time (s since 1970), duration, url, height, key}: only
            // from a timeline, whose times are the segments' own.
            function videoSegmentsOf(mpd, zero) {
                const out = [];
                const now = Date.now() / 1000;
                const top = baseOf(mpd, manifestUrl);
                for (const period of children(mpd, 'Period')) {
                    const start = zero + (seconds(period.getAttribute('start')) || 0);
                    lowestVideo(period).forEach((of, height) => {
                        const template = children(of.set, 'SegmentTemplate')[0] || children(of.rep, 'SegmentTemplate')[0];
                        if (!template || !children(template, 'SegmentTimeline')[0]) return;
                        const base = baseOf(of.rep, baseOf(of.set, baseOf(period, top)));
                        for (const segment of segmentsOf(of.set, base, now - start, of.rep)) {
                            const time = start + segment.time;
                            out.push({ time, duration: segment.duration, url: segment.url, height, key: height + ' ' + time });
                        }
                    });
                }
                return out;
            }

            // The video set and representation read for each height of a period that AdRule.BLACKS
            // lists, the lowest there, as {set, rep} by height.
            function lowestVideo(period) {
                const chosen = new Map();
                for (const s of children(period, 'AdaptationSet')) {
                    if (s.getAttribute('contentType') !== 'video' && !/^video\//.test(s.getAttribute('mimeType') || '')) continue;
                    for (const r of children(s, 'Representation')) {
                        const bandwidth = Number(r.getAttribute('bandwidth'));
                        const height = Number(r.getAttribute('height') || s.getAttribute('height'));
                        if (!(bandwidth > 0) || !AdRule.BLACKS[height]) continue;
                        const was = chosen.get(height);
                        if (!was || bandwidth < Number(was.rep.getAttribute('bandwidth'))) chosen.set(height, { set: s, rep: r });
                    }
                }
                return chosen;
            }

            // The first length bytes at url, all of it when length is null, or why they cannot be had:
            // the answer's status or the error's name, as a string.
            async function head(url, length) {
                const abort = new AbortController();
                const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
                try {
                    const ask = { credentials: 'omit', signal: abort.signal };
                    if (length !== null) ask.headers = { Range: 'bytes=0-' + (length - 1) };
                    const response = await fetch(url, ask);
                    if (!response.ok) return 'http ' + response.status;
                    const bytes = new Uint8Array(await response.arrayBuffer());
                    // A server that sends all of it, not heeding the range.
                    return length !== null && bytes.length > length ? bytes.subarray(0, length) : bytes;
                } catch (e) {
                    return String((e && e.name) || 'error');
                } finally {
                    clearTimeout(timer);
                }
            }

            // Where the blacks in a segment end, or why it cannot be read, as a string.
            async function blacksOf(segment) {
                let bytes = await head(segment.url, whole ? null : HEAD_BYTES);
                if (typeof bytes === 'string') return bytes;
                const end = AdRule.moofEnd(bytes);
                if (end === null) return 'no header';
                if (end > bytes.length) bytes = await head(segment.url, end);
                if (typeof bytes === 'string') return bytes;
                const sizes = AdRule.frameSizes(bytes);
                if (sizes === null || sizes.length === 0) return 'no frames';
                return AdRule.separatorEnds(sizes, segment.time, segment.duration / sizes.length, AdRule.BLACKS[segment.height]);
            }

            // Whether part of a segment cannot be read here when the whole of one can, once the browser
            // refused every read of todo (got): a Chromecast's refuses any read in part, a lost network
            // refuses both, or neither once back. Tried on the newest of the lowest rendition: the oldest
            // may be gone from a live window.
            async function partRefused(todo, got) {
                if (whole || todo.length === 0 || !got.every(g => g === 'TypeError')) return false;
                const probe = todo.filter(s => s.height === WHOLE_HEIGHT).pop();
                const all = probe ? await head(probe.url, null) : 'none';
                const part = typeof all === 'string' ? all : await head(probe.url, HEAD_BYTES);
                return typeof all !== 'string' && part === 'TypeError';
            }

            // Whether a segment that could not be read, as miss ({times, at}) says, is asked for again:
            // at the next looks, TRIES times in all, then SEGMENT_AGAIN_S later, twice as long after
            // each later try, SEGMENT_LATER times.
            function readAgain(miss) {
                if (miss === undefined) return false;
                const later = miss.times - TRIES;
                return later < 0 || (later < SEGMENT_LATER && Date.now() / 1000 - miss.at >= SEGMENT_AGAIN_S * 2 ** later);
            }

            // The blacks around the playhead (at, with the live point at end, s since 1970), read where
            // not known yet, and the breaks they make. One that cannot be read has none, which ends a
            // break rather than making one, and is asked for again (see readAgain).
            async function readSeparators(at, end, mine) {
                const from = at - SEPARATED_FAR_S;
                const newest = videoSegments.reduce((most, s) => Math.max(most, s.time + s.duration), -Infinity);
                const fresh = newest + (Date.now() / 1000 - videoSegmentsAt) - SEGMENT_FRESH_S;
                const to = Math.min(end - SEGMENT_NOT_YET_S, fresh, at + SEPARATED_FAR_S);
                const todo = videoSegments.filter(s => (!whole || s.height === WHOLE_HEIGHT) && s.time + s.duration > from && s.time < to &&
                    (!blacks.has(s.key) || readAgain(blackMisses.get(s.key))));
                const got = await each(todo, whole ? WHOLE_AT_ONCE : AT_ONCE, blacksOf);
                if (mine !== playing) return;
                // Every read refused, and part of a segment cannot be read here: the lowest rendition's
                // are read whole from the next look.
                const refused = await partRefused(todo, got);
                if (mine !== playing) return;
                if (refused) {
                    whole = true;
                    readFailures += todo.length;
                    readFailure = 'TypeError';
                    separatorsState = 'segments ' + blacks.size + ', whole ' + WHOLE_HEIGHT + 'p next, failed ' + readFailures + ' (' + readFailure + ')';
                    return;
                }
                todo.forEach((s, i) => {
                    const failed = typeof got[i] === 'string';
                    if (failed) {
                        blackMisses.set(s.key, { times: (blackMisses.has(s.key) ? blackMisses.get(s.key).times : 0) + 1, at: Date.now() / 1000 });
                        readFailures++;
                        readFailure = got[i];
                    } else {
                        blackMisses.delete(s.key);
                    }
                    blacks.set(s.key, { time: s.time, ends: failed ? [] : got[i] });
                });
                // A break longer than the reach keeps its start: what is read stays twice as long.
                for (const k of Array.from(blacks.keys())) {
                    if (blacks.get(k).time >= at - 2 * SEPARATED_FAR_S) continue;
                    blacks.delete(k);
                    blackMisses.delete(k);
                }
                const ends = [];
                for (const read of blacks.values()) for (const e of read.ends) ends.push(e);
                separated = AdRule.separatedBreaks(ends);
                separatorsState = 'segments ' + blacks.size + (whole ? ' whole ' + WHOLE_HEIGHT + 'p' : '') + ', blacks ' + ends.length +
                    ', breaks ' + separated.length + (readFailures > 0 ? ', failed ' + readFailures + ' (' + readFailure + ')' : '');
            }

            // What each picture of a live channel has of its logo, read where it is not known yet, for
            // the stream mine: none is asked for once another plays, nor kept.
            async function readPictures(from, to, mine) {
                const wanted = [];
                for (let time = from; time <= to; time += STEP_S) {
                    if (!scores.has(time) || (missed.has(time) && missed.get(time) < TRIES)) wanted.push(time);
                }
                if (wanted.length === 0) return;
                const used = logo;
                const url = thumbnailsUrl;
                const got = await each(wanted, 4, async time => {
                    if (mine !== playing) return null;
                    const data = await pixels(url + '/' + time, PICTURE_WIDTH, PICTURE_HEIGHT);
                    if (data === null) return null;
                    const luma = lumaOf(data, PICTURE_WIDTH, 0);
                    return [AdRule.score(used, luma), used.lower ? AdRule.score(used.lower, luma) : null];
                });
                if (mine !== playing || used !== logo) return;
                wanted.forEach((time, i) => {
                    // One that cannot be had counts as showing the logo, and is asked for again.
                    if (got[i] === null) missed.set(time, (missed.get(time) || 0) + 1);
                    else missed.delete(time);
                    scores.set(time, got[i] === null ? used.usual : got[i][0]);
                    if (used.lower) lowerScores.set(time, got[i] === null ? used.lower.usual : got[i][1]);
                });
            }

            // The pictures of times that can be had, as their luma row by row, for the stream mine.
            async function picturesAt(times, mine) {
                const url = thumbnailsUrl;
                return (await each(times, 4, async time => {
                    if (mine !== playing) return null;
                    const data = await pixels(url + '/' + time, PICTURE_WIDTH, PICTURE_HEIGHT);
                    return data === null ? null : lumaOf(data, PICTURE_WIDTH, 0);
                })).filter(p => p !== null);
            }

            // The logo of pictures, null when none stands out.
            function logoIn(pictures) {
                if (pictures.length === 0) return null;
                const track = AdRule.track(pictures.length, PICTURE_WIDTH, PICTURE_HEIGHT);
                pictures.forEach((picture, i) => track.add(i, picture));
                return track.logo();
            }

            async function learn(at, last, mine) {
                const times = [];
                for (let time = at - LEARN_SPAN_S; time <= Math.min(last, at + LEARN_SPAN_S); time += LEARN_EVERY_S) times.push(time);
                // Nothing changes until the pictures are in, and the earlier ones looked at where needed.
                const pictures = await picturesAt(times, mine);
                // Another stream was loaded meanwhile: what was learnt is not its logo.
                if (mine !== playing) return;
                // None could be had, as when the connection is lost for a moment: what was learnt before
                // stays, and the learn is tried again as when it finds nothing.
                if (pictures.length === 0) {
                    again(at);
                    return;
                }
                const own = logoIn(pictures);
                if (own !== null && own.channel) remembered.set(thumbnailsUrl, AdRule.alone(own));
                // Where no logo stands out, as when most of the pictures are of adverts and trailers, the
                // channel's from before, when seen on enough of them: the last found, or else one looked
                // for in the earlier pictures, once a stream. One learnt over another programme can fit
                // these pictures too poorly: the top left corner of M6's teleshopping holds its own logo.
                let kept = null;
                if (own === null) {
                    const known = remembered.get(thumbnailsUrl);
                    if (known && AdRule.seenIn(known, pictures, KEPT_SEEN)) {
                        kept = known;
                    } else if (searchedFor !== thumbnailsUrl) {
                        const back = await earlier(at, mine);
                        if (mine !== playing) return;
                        if (back !== null) {
                            remembered.set(thumbnailsUrl, back);
                            if (AdRule.seenIn(back, pictures, KEPT_SEEN)) kept = back;
                        }
                    }
                }
                learntAt = at;
                logo = kept || own;
                scores = new Map();
                lowerScores = new Map();
                missed = new Map();
                logoState = logo === null ? 'none in ' + pictures.length + ' pictures'
                    : 'strength ' + Math.round(logo.strength) + (logo.lower ? ', lower one ' + Math.round(logo.lower.strength) : '') + (kept !== null ? ', kept' : '');
                // Nothing learnt: tried again a little further on, then less and less often, as each try
                // fetches all its pictures again.
                if (logo === null) again(at);
                else failures = 0;
            }

            // Nothing learnt at at: the next learn, further on as more fail in a row.
            function again(at) {
                learntAt = at - LEARN_AGAIN_S + Math.min(LEARN_AGAIN_S, LEARN_RETRY_S * 2 ** failures);
                if (LEARN_RETRY_S * 2 ** failures < LEARN_AGAIN_S) failures++;
            }

            // The channel's logo as the pictures before those around at show it, forty minutes of them
            // at a time, the nearest first, up to EARLIER_TIMES of them: for a channel opened in the
            // middle of a long block of adverts and trailers, where its logo is faint and stands out
            // only where the programme fills most of the pictures. Null when it stands out in none.
            async function earlier(at, mine) {
                let seen = null;
                for (let back = 0; back < EARLIER_TIMES; back++) {
                    const end = at - LEARN_SPAN_S - back * 2 * LEARN_SPAN_S;
                    const times = [];
                    for (let time = end - 2 * LEARN_SPAN_S; time < end; time += LEARN_EVERY_S) times.push(time);
                    const pictures = await picturesAt(times, mine);
                    if (mine !== playing) return null;
                    // None of the nearest could be had, as when the connection is lost: looked for again at
                    // the next learn. None further on: older than the service keeps them, as are those before.
                    if (pictures.length === 0) {
                        if (back === 0) return null;
                        break;
                    }
                    const got = logoIn(pictures);
                    if (got !== null && got.channel) {
                        seen = AdRule.alone(got);
                        break;
                    }
                }
                // Only once searched to the end.
                searchedFor = thumbnailsUrl;
                return seen;
            }

            // The pictures read, without a gap, around at: the time of the first, and whether each
            // is without the logo.
            function knownAround(at) {
                let first = at;
                while (scores.has(first - STEP_S)) first -= STEP_S;
                const score = [];
                const lower = [];
                for (let time = first; scores.has(time); time += STEP_S) {
                    score.push(scores.get(time));
                    if (logo.lower) lower.push(lowerScores.has(time) ? lowerScores.get(time) : logo.lower.usual);
                }
                const all = score.map(() => true);
                return {
                    first,
                    gone: AdRule.gone(score, logo.usual, all),
                    lowerGone: logo.lower ? AdRule.gone(lower, logo.lower.usual, all) : null,
                };
            }

            // The breaks the logo gives away around the playhead, at seconds since 1970 with the
            // live point at liveAt.
            async function lookForLogo(atSeconds, liveAt, mine) {
                const at = Math.floor(atSeconds / STEP_S) * STEP_S;
                const last = Math.floor((liveAt - NOT_YET_S) / STEP_S) * STEP_S;
                if (at > last) return;
                // Not learnt again in a break: all that is known of it would be read again with the new
                // logo, and the break be lost the while. Once out of it, as late as a break may last.
                const since = Math.abs(at - learntAt);
                const held = found.some(b => b[0] <= at && at <= b[1]) && since <= LEARN_AGAIN_S + AdRule.LOGO_MAX_S;
                if (since > LEARN_AGAIN_S && !held) await learn(at, last, mine);
                if (logo === null || mine !== playing) return;
                await readPictures(at - BACK_S, Math.min(last, at + AHEAD_S), mine);
                for (let more = 0; more < MORE_TIMES; more++) {
                    if (mine !== playing || !scores.has(at)) return;
                    const around = knownAround(at);
                    const count = around.gone.length;
                    const until = around.first + count * STEP_S;
                    // The show's logo is followed too: adverts can keep the channel's seen through half a
                    // break (see AdRule.logoBreaks), which the show's alone then gives.
                    const stretches = AdRule.runs(AdRule.solid(around.gone), AdRule.BRIDGE)
                        .concat(around.lowerGone ? AdRule.runs(AdRule.solid(around.lowerGone), AdRule.BRIDGE) : []);
                    const open = stretches.some(r => r[1] + AdRule.AROUND >= count && (count - r[0]) * STEP_S <= FAR_S);
                    // Back only for the break the playhead is in: one over before it has nothing to skip.
                    const here = (at - around.first) / STEP_S;
                    const begun = stretches.some(r => r[0] < AdRule.AROUND && r[1] >= here && (r[1] + 1) * STEP_S <= FAR_S);
                    if (open && until <= last) await readPictures(until, Math.min(last, until + MORE_S), mine);
                    else if (begun && around.first > at - FAR_S) await readPictures(around.first - MORE_S, around.first - STEP_S, mine);
                    else break;
                }
                if (mine !== playing || logo === null || !scores.has(at)) return;
                const around = knownAround(at);
                found = AdRule.logoBreaks(around.gone, around.first, STEP_S, around.lowerGone);
                for (const time of Array.from(scores.keys())) if (time < at - KEPT_S) scores.delete(time);
                for (const time of Array.from(lowerScores.keys())) if (time < at - KEPT_S) lowerScores.delete(time);
                for (const time of Array.from(missed.keys())) if (time < at - KEPT_S) missed.delete(time);
            }

            // Where playback is, and the live point, in seconds since 1970; null when it cannot be told.
            function liveTimes() {
                const range = env.liveRange();
                const now = env.currentTime();
                if (!range || typeof now !== 'number' || !isFinite(now) || !isFinite(range.end)) return null;
                const at = env.absoluteTime(now);
                const end = env.absoluteTime(range.end);
                // Not a time of day, as when the stream gives none: within the day, or nothing.
                const wall = Date.now() / 1000;
                if (typeof at !== 'number' || typeof end !== 'number' || !(at > wall - 86400 && at < wall + 600) || !(end >= at)) return null;
                return { at, end };
            }

            async function lookLive(mine) {
                if (looking === mine) return;
                looking = mine;
                try {
                    const times = liveTimes();
                    // Only behind the live point: at it there is nowhere to skip to.
                    if (times === null || times.end - times.at <= BEHIND_S) return;
                    if (Date.now() - markedAt >= MARKED_EVERY_MS && manifestUrl) {
                        markedAt = Date.now();
                        await readMarked(mine);
                    }
                    if (separating && mine === playing) await readSeparators(times.at, times.end, mine);
                    if (thumbnailsUrl !== null && mine === playing) await lookForLogo(times.at, times.end, mine);
                } catch (e) {
                    logoState = 'error: ' + String(e && e.message).slice(0, 40);
                } finally {
                    if (looking === mine) looking = 0;
                }
            }

            // Once a second: the break playback is in, if any, is offered with the pill.
            function tick() {
                let end = null;
                try {
                    const state = env.state();
                    if (key !== null && (state === 'playing' || state === 'paused')) {
                        const now = env.currentTime();
                        if (wanted !== null && state === 'playing') {
                            const search = wanted;
                            wanted = null;
                            if (search.mine === playing) searchRecording(search.url, search.name, search.mine);
                        }
                        const early = b => [b[0], b[1] - GUESS_EARLY_S];
                        if (!live) {
                            // The blacks between the adverts first, whose ends are in them, then the
                            // pictures and captions, to some seconds before where they end.
                            const here = b => now >= b[0] && now < b[1] - LAST_MOMENT_S;
                            const s = recordedSeparated.filter(here)[0];
                            const inside = s ? [s[0], AdRule.askedEnd(s, recorded.map(early))] : recorded.map(early).filter(here)[0];
                            if (inside) end = inside[1];
                        } else if (!env.joining()) {
                            // Not while the stream is still joining the live point: it stands at the start
                            // of its window then, which is no place it is watched from.
                            const times = liveTimes();
                            if (times !== null) {
                                // What the manifest marks is exact, and comes first; then the blacks between
                                // adverts, whose ends are in them; then what the logo finds, to the end of
                                // those blacks when it runs into them.
                                const here = b => times.at >= b[0] && times.at < b[1] - LAST_MOMENT_S && b[1] <= times.end - LIVE_MARGIN_S;
                                const guesses = found.map(early).map(b => AdRule.reachSeparated(b, separated));
                                // In the blacks of a break, as far as the logo's break it lies in, once that ends.
                                const s = separated.filter(here)[0];
                                const reached = guesses.filter(g => g[1] <= times.end - LIVE_MARGIN_S);
                                const inside = marked.filter(here)[0] || (s && [s[0], AdRule.askedEnd(s, reached)]) || guesses.filter(here)[0];
                                if (inside) {
                                    const target = env.mediaTime(inside[1]);
                                    if (typeof target === 'number' && isFinite(target) && target > now) end = target;
                                }
                            }
                            if (Date.now() - lookedAt >= LOOK_EVERY_MS) {
                                lookedAt = Date.now();
                                lookLive(playing);
                            }
                        }
                    }
                } catch (e) {
                    end = null;
                }
                offered = end;
                shown = env.show(offered !== null);
            }

            // OK was pressed with the pill up: true when the break was skipped.
            function skip() {
                if (offered === null || !shown) return false;
                const target = offered;
                offered = null;
                shown = env.show(false);
                env.seek(target);
                return true;
            }

            // What the search is at, for the status: no address, no credential. With where the skip on
            // offer leads (skip_to, media time), for a sender to offer it too.
            function report() {
                const out = { live, offered: offered !== null, skip_to: offered };
                if (live) {
                    out.marked = markedState;
                    out.logo = thumbnailsUrl === null ? 'no pictures' : logoState;
                    out.found = found.length;
                    if (separating) out.separators = separatorsState;
                    try {
                        const times = liveTimes();
                        out.clock = times === null ? 'none' : Math.round(Date.now() / 1000 - times.end) + ' s behind at the live point';
                    } catch (e) {
                        out.clock = 'error';
                    }
                } else {
                    out.recording = recordedState;
                    out.breaks = recorded.map(b => [Math.round(b[0]), Math.round(b[1])]);
                    out.separators = separatorsState;
                    out.separated = recordedSeparated.map(b => [Math.round(b[0]), Math.round(b[1])]);
                }
                return out;
            }

            return { load, tick, skip, report };
        }
        // </ad-skip>
export { AdRule, makeAdSkip };
