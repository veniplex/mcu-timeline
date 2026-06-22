import type { ChronologyEntry } from './types';

/**
 * Curated in-universe chronology of the Marvel Cinematic Universe.
 *
 * Ordering authority is HYBRID: Marvel's official timeline (Disney+ "Timeline
 * Order" + the official timeline book) where it exists, fan/wiki consensus to
 * fill gaps. `order` is sparse (step 10) so future inserts don't renumber.
 *
 * `phase` is the canonical Marvel Studios Phase each title belongs to. Legacy
 * ABC/Netflix TV and non-Studios tie-ins are mapped to the Phase matching their
 * release era (flagged in `source`). The timeline groups consecutive same-phase
 * entries into labeled bands in whichever sort is active.
 *
 * Series are single season-blocks unless their events interleave with other
 * titles at episode granularity (none currently do in the core MCU).
 *
 * Coverage: complete theatrical slate (Phases 1-6) + all Marvel Studios Disney+
 * series & specials, plus a representative set of legacy TV, animation and the
 * Sony tie-ins. The long tail (every AoS / Netflix episode-season, Hulu/Freeform
 * shows) extends here without code changes.
 */
export const chronology: ChronologyEntry[] = [
	{
		id: 'captain-america-the-first-avenger',
		order: 10,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: The First Avenger', year: 2011 },
		eraTag: 'WWII',
		source: 'Official timeline (1943-45)'
	},
	{
		id: 'agent-carter-s1',
		order: 20,
		phase: 2,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agent Carter', year: 2015, season: 1 },
		eraTag: '1946',
		source: 'Legacy ABC TV mapped to Phase 2 release era'
	},
	{
		id: 'agent-carter-s2',
		order: 30,
		phase: 2,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agent Carter', year: 2015, season: 2 },
		eraTag: '1947',
		source: 'Legacy ABC TV mapped to Phase 2 release era'
	},
	{
		id: 'captain-marvel',
		order: 40,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain Marvel', year: 2019 },
		eraTag: '1995',
		source: 'Official timeline (1995)'
	},
	{
		id: 'iron-man',
		order: 50,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Iron Man', year: 2008 },
		eraTag: 'Modern era',
		source: 'Official timeline (2010)'
	},
	{
		id: 'iron-man-2',
		order: 60,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Iron Man 2', year: 2010 },
		source: 'Official timeline (2011)'
	},
	{
		id: 'the-incredible-hulk',
		order: 70,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'The Incredible Hulk', year: 2008 },
		source: 'Official timeline (2011), concurrent with Iron Man 2'
	},
	{
		id: 'thor',
		order: 80,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Thor', year: 2011 },
		source: 'Official timeline (2011)'
	},
	{
		id: 'the-avengers',
		order: 90,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'The Avengers', year: 2012 },
		eraTag: 'Battle of New York',
		source: 'Official timeline (2012)'
	},
	{
		id: 'iron-man-3',
		order: 100,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Iron Man 3', year: 2013 },
		source: 'Official timeline (2012, Christmas)'
	},
	{
		id: 'thor-the-dark-world',
		order: 110,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Thor: The Dark World', year: 2013 },
		source: 'Official timeline (2013)'
	},
	{
		id: 'captain-america-the-winter-soldier',
		order: 120,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: The Winter Soldier', year: 2014 },
		source: 'Official timeline (2014)'
	},
	{
		id: 'agents-of-shield-s1',
		order: 130,
		phase: 2,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.', year: 2013, season: 1 },
		source: 'Legacy ABC TV; S1 climax ties to Winter Soldier (Phase 2)'
	},
	{
		id: 'guardians-of-the-galaxy',
		order: 140,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Guardians of the Galaxy', year: 2014 },
		source: 'Official timeline (2014)'
	},
	{
		id: 'guardians-of-the-galaxy-vol-2',
		order: 150,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Guardians of the Galaxy Vol. 2', year: 2017 },
		source: 'Official timeline (2014, months after Vol. 1)'
	},
	{
		id: 'daredevil-s1',
		order: 160,
		phase: 2,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Daredevil', year: 2015, season: 1 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; mapped to Phase 2 release era'
	},
	{
		id: 'jessica-jones-s1',
		order: 170,
		phase: 2,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Jessica Jones', year: 2015, season: 1 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; mapped to Phase 2 release era'
	},
	{
		id: 'avengers-age-of-ultron',
		order: 180,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Avengers: Age of Ultron', year: 2015 },
		source: 'Official timeline (2015)'
	},
	{
		id: 'ant-man',
		order: 190,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Ant-Man', year: 2015 },
		source: 'Official timeline (2015)'
	},
	{
		id: 'captain-america-civil-war',
		order: 200,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: Civil War', year: 2016 },
		source: 'Official timeline (2016)'
	},
	{
		id: 'black-widow',
		order: 210,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Black Widow', year: 2021 },
		source: 'Official timeline (2016, immediately after Civil War)'
	},
	{
		id: 'spider-man-homecoming',
		order: 220,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Spider-Man: Homecoming', year: 2017 },
		source: 'Official timeline (2016)'
	},
	{
		id: 'black-panther',
		order: 230,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Black Panther', year: 2018 },
		source: 'Official timeline (2017, week after Civil War)'
	},
	{
		id: 'doctor-strange',
		order: 240,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Doctor Strange', year: 2016 },
		source: 'Official timeline (2016-2017)'
	},
	{
		id: 'thor-ragnarok',
		order: 250,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Thor: Ragnarok', year: 2017 },
		source: 'Official timeline (2017)'
	},
	{
		id: 'ant-man-and-the-wasp',
		order: 260,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Ant-Man and the Wasp', year: 2018 },
		source: 'Official timeline (2018, during Infinity War)'
	},
	{
		id: 'avengers-infinity-war',
		order: 270,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Avengers: Infinity War', year: 2018 },
		eraTag: 'The Blip',
		source: 'Official timeline (2018)'
	},
	{
		id: 'avengers-endgame',
		order: 280,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Avengers: Endgame', year: 2019 },
		eraTag: 'The Blip / 2023',
		source: 'Official timeline (2018 & 2023 after 5-year jump)'
	},
	{
		id: 'loki-s1',
		order: 290,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'Loki', year: 2021, season: 1 },
		eraTag: 'TVA / multiverse',
		source: 'Official timeline; branches from 2012 Loki, outside main timeline'
	},
	{
		id: 'loki-s2',
		order: 300,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'Loki', year: 2021, season: 2 },
		eraTag: 'TVA / multiverse',
		source: 'Official timeline; continues directly from S1'
	},
	{
		id: 'what-if-s1',
		order: 310,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'What If...?', year: 2021, season: 1 },
		eraTag: 'Multiverse',
		source: 'Animated; alternate realities, placed post-Endgame per Marvel'
	},
	{
		id: 'wandavision',
		order: 320,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'WandaVision', year: 2021, season: 1 },
		eraTag: 'Post-Blip (2023)',
		source: 'Official timeline (2023, ~3 weeks after Endgame)'
	},
	{
		id: 'the-falcon-and-the-winter-soldier',
		order: 330,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'The Falcon and the Winter Soldier', year: 2021, season: 1 },
		eraTag: 'Post-Blip (2024)',
		source: 'Official timeline (2024)'
	},
	{
		id: 'shang-chi',
		order: 340,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Shang-Chi and the Legend of the Ten Rings', year: 2021 },
		source: 'Official timeline (2024)'
	},
	{
		id: 'eternals',
		order: 350,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Eternals', year: 2021 },
		source: 'Official timeline (2024)'
	},
	{
		id: 'spider-man-far-from-home',
		order: 360,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Spider-Man: Far From Home', year: 2019 },
		source: 'Official timeline (2024, 8 months after Endgame)'
	},
	{
		id: 'hawkeye',
		order: 370,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'Hawkeye', year: 2021, season: 1 },
		eraTag: 'Christmas 2024',
		source: 'Official timeline (2024)'
	},
	{
		id: 'spider-man-no-way-home',
		order: 380,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Spider-Man: No Way Home', year: 2021 },
		source: 'Official timeline (2024, after Far From Home)'
	},
	{
		id: 'doctor-strange-multiverse-of-madness',
		order: 390,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Doctor Strange in the Multiverse of Madness', year: 2022 },
		source: 'Official timeline (2025, after No Way Home & WandaVision)'
	},
	{
		id: 'moon-knight',
		order: 400,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'Moon Knight', year: 2022, season: 1 },
		source: 'Official timeline; placement approximate (fan consensus)'
	},
	{
		id: 'ms-marvel',
		order: 410,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'Ms. Marvel', year: 2022, season: 1 },
		source: 'Official timeline; leads into The Marvels'
	},
	{
		id: 'thor-love-and-thunder',
		order: 420,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Thor: Love and Thunder', year: 2022 },
		source: 'Official timeline'
	},
	{
		id: 'she-hulk',
		order: 430,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'She-Hulk: Attorney at Law', year: 2022, season: 1 },
		source: 'Official timeline'
	},
	{
		id: 'werewolf-by-night',
		order: 440,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Werewolf by Night', year: 2022 },
		source: 'Disney+ special presentation'
	},
	{
		id: 'black-panther-wakanda-forever',
		order: 450,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Black Panther: Wakanda Forever', year: 2022 },
		source: 'Official timeline'
	},
	{
		id: 'guardians-holiday-special',
		order: 460,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'The Guardians of the Galaxy Holiday Special', year: 2022 },
		eraTag: 'Christmas',
		source: 'Disney+ special presentation'
	},
	{
		id: 'ant-man-quantumania',
		order: 470,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Ant-Man and the Wasp: Quantumania', year: 2023 },
		source: 'Official timeline (opens Phase 5)'
	},
	{
		id: 'guardians-of-the-galaxy-vol-3',
		order: 480,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Guardians of the Galaxy Vol. 3', year: 2023 },
		source: 'Official timeline'
	},
	{
		id: 'secret-invasion',
		order: 490,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'Secret Invasion', year: 2023, season: 1 },
		source: 'Official timeline'
	},
	{
		id: 'the-marvels',
		order: 500,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'The Marvels', year: 2023 },
		source: 'Official timeline (after Ms. Marvel)'
	},
	{
		id: 'echo',
		order: 510,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'Echo', year: 2024, season: 1 },
		source: 'Official timeline (after Hawkeye)'
	},
	{
		id: 'agatha-all-along',
		order: 520,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'Agatha All Along', year: 2024, season: 1 },
		source: 'Official timeline (after WandaVision)'
	},
	{
		id: 'deadpool-and-wolverine',
		order: 530,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Deadpool & Wolverine', year: 2024 },
		eraTag: 'Multiverse / TVA',
		source: 'Official timeline'
	},
	{
		id: 'captain-america-brave-new-world',
		order: 540,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: Brave New World', year: 2025 },
		source: 'Official timeline'
	},
	{
		id: 'daredevil-born-again-s1',
		order: 550,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'Daredevil: Born Again', year: 2025, season: 1 },
		source: 'Official timeline'
	},
	{
		id: 'thunderbolts',
		order: 560,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Thunderbolts*', year: 2025 },
		source: 'Official timeline'
	},
	{
		id: 'ironheart',
		order: 570,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'Ironheart', year: 2025, season: 1 },
		source: 'Official timeline (after Wakanda Forever)'
	},
	{
		id: 'the-fantastic-four-first-steps',
		order: 580,
		phase: 6,
		kind: 'movie',
		query: { type: 'movie', title: 'The Fantastic Four: First Steps', year: 2025 },
		eraTag: 'Alternate universe (Earth-828)',
		source: 'Official timeline (opens Phase 6)'
	},

	/* ---- Animation ---- */
	{
		id: 'x-men-97-s1',
		order: 600,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'X-Men \'97', year: 2024, season: 1 },
		eraTag: 'Alternate universe',
		source: 'Animated revival; separate continuity, grouped by Phase 5 release'
	},

	/* ---- Sony tie-ins (SSU — contested/loose canon) ---- */
	{
		id: 'venom',
		order: 700,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Venom', year: 2018 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; loose MCU connection, grouped by release era'
	},
	{
		id: 'venom-let-there-be-carnage',
		order: 710,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Venom: Let There Be Carnage', year: 2021 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; mid-credits crosses into MCU (No Way Home)'
	}
];
