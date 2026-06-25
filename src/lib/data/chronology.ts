import type { Category, ChronologyEntry } from './types';

/**
 * Catalogue category per entry id. Only non-`studios` titles are listed here —
 * anything absent defaults to `studios` (Marvel Studios theatrical + Disney+
 * originals, incl. Daredevil: Born Again). Keeping it as one map (rather than a
 * field on every entry) means contributors touch a single, readable list.
 */
const CATEGORY_BY_ID: Record<string, Category> = {
	// Defenders Saga (Netflix)
	'daredevil-s1': 'netflix',
	'daredevil-s2': 'netflix',
	'daredevil-s3': 'netflix',
	'jessica-jones-s1': 'netflix',
	'jessica-jones-s2': 'netflix',
	'jessica-jones-s3': 'netflix',
	'luke-cage-s1': 'netflix',
	'luke-cage-s2': 'netflix',
	'iron-fist-s1': 'netflix',
	'iron-fist-s2': 'netflix',
	'the-defenders': 'netflix',
	'the-punisher-s1': 'netflix',
	'the-punisher-s2': 'netflix',
	// Legacy ABC / Hulu / Freeform TV
	'agent-carter-s1': 'legacy-tv',
	'agent-carter-s2': 'legacy-tv',
	'agents-of-shield-s1': 'legacy-tv',
	'agents-of-shield-s2': 'legacy-tv',
	'agents-of-shield-s3': 'legacy-tv',
	'agents-of-shield-s4': 'legacy-tv',
	'agents-of-shield-s5': 'legacy-tv',
	'agents-of-shield-s6': 'legacy-tv',
	'agents-of-shield-s7': 'legacy-tv',
	inhumans: 'legacy-tv',
	'runaways-s1': 'legacy-tv',
	'runaways-s2': 'legacy-tv',
	'runaways-s3': 'legacy-tv',
	'cloak-and-dagger-s1': 'legacy-tv',
	'cloak-and-dagger-s2': 'legacy-tv',
	helstrom: 'legacy-tv',
	'aos-slingshot': 'legacy-tv',
	'whih-newsfront': 'legacy-tv',
	// Animation (alternate continuities)
	'what-if-s1': 'animated',
	'what-if-s2': 'animated',
	'what-if-s3': 'animated',
	'x-men-97-s1': 'animated',
	'x-men-97-s2': 'animated',
	'your-friendly-neighborhood-spider-man-s1': 'animated',
	'marvel-zombies': 'animated',
	'eyes-of-wakanda': 'animated',
	'i-am-groot-s1': 'animated',
	'i-am-groot-s2': 'animated',
	// Sony tie-ins (SSU)
	venom: 'sony',
	'venom-let-there-be-carnage': 'sony',
	morbius: 'sony',
	'madame-web': 'sony',
	'venom-the-last-dance': 'sony',
	'kraven-the-hunter': 'sony'
};

/** Category for a chronology entry id (defaults to `studios`). */
export function categoryOf(id: string): Category {
	return CATEGORY_BY_ID[id] ?? 'studios';
}

/**
 * Rotten Tomatoes show path (after rottentomatoes.com/) per series id. RT has no
 * API and OMDb returns no RT score for TV, so these hand-curated slugs drive both
 * the show link AND the build-time RT-score scrape (scripts/fetch-ratings.ts), as
 * well as per-episode RT links (…/sNN/eNN). One slug per show, applied to every
 * season entry of that show.
 */
const RT_TV_SLUG: Record<string, string> = {
	'agent-carter': 'tv/marvels_agent_carter',
	'agents-of-shield': 'tv/marvels_agents_of_shield',
	daredevil: 'tv/daredevil',
	'jessica-jones': 'tv/marvels_jessica_jones',
	'luke-cage': 'tv/luke_cage',
	'iron-fist': 'tv/marvels_iron_fist',
	'the-defenders': 'tv/marvels_the_defenders',
	'the-punisher': 'tv/marvels_the_punisher',
	inhumans: 'tv/marvels_inhumans',
	runaways: 'tv/marvels_runaways',
	'cloak-and-dagger': 'tv/marvels_cloak_and_dagger',
	helstrom: 'tv/marvels_helstrom',
	loki: 'tv/loki',
	wandavision: 'tv/wandavision',
	'what-if': 'tv/what_if',
	'the-falcon-and-the-winter-soldier': 'tv/the_falcon_and_the_winter_soldier',
	hawkeye: 'tv/hawkeye',
	'moon-knight': 'tv/moon_knight',
	'ms-marvel': 'tv/ms_marvel',
	'she-hulk': 'tv/she_hulk_attorney_at_law',
	'secret-invasion': 'tv/secret_invasion',
	echo: 'tv/echo',
	'agatha-all-along': 'tv/agatha_all_along',
	'daredevil-born-again': 'tv/daredevil_born_again',
	ironheart: 'tv/ironheart',
	'x-men-97': 'tv/x_men_97',
	'your-friendly-neighborhood-spider-man': 'tv/your_friendly_neighborhood_spider_man',
	'marvel-zombies': 'tv/marvel_zombies',
	'eyes-of-wakanda': 'tv/eyes_of_wakanda',
	'i-am-groot': 'tv/i_am_groot',
	'wonder-man': 'tv/wonder_man'
};

/**
 * RT slug for any chronology entry: an explicit per-entry `rtSlug` (movies) wins,
 * otherwise the show-level TV slug derived from the entry id (strips a trailing
 * `-sN` season suffix). Returns undefined when none is known.
 */
export function rtSlugOf(entry: ChronologyEntry): string | undefined {
	if (entry.rtSlug) return entry.rtSlug;
	const base = entry.id.replace(/-s\d+$/, '');
	return RT_TV_SLUG[base] ?? RT_TV_SLUG[entry.id];
}

/**
 * Curated in-universe chronology of the Marvel Cinematic Universe.
 *
 * Ordering authority is HYBRID: Marvel's official timeline (Disney+ "Timeline
 * Order" + the official timeline book) where it exists, fan/wiki consensus to
 * fill gaps. `order` is sparse (step 10) so future inserts don't renumber.
 *
 * `phase` is the canonical Marvel Studios Phase each title belongs to. Legacy
 * ABC/Netflix/Hulu/Freeform TV, animation and non-Studios tie-ins are mapped to
 * the Phase matching their RELEASE era (flagged in `source`) — Marvel never gave
 * most of them precise in-universe dates, so these are grouped by air-date, not
 * pinned to a story year. The timeline groups consecutive same-phase entries
 * into labeled bands in whichever sort is active.
 *
 * Series are single season-blocks. `order` for legacy TV reflects premiere date
 * so seasons stay consecutive and read in airing order within their phase band.
 *
 * Coverage is maximal — everything watchable that fits the timeline, even
 * loosely: the complete theatrical slate (Phases 1-6), all five Marvel One-Shots,
 * the Team Thor mockumentary shorts, every Marvel Studios Disney+ series, special
 * & short (incl. I Am Groot, Wonder Man, VisionQuest), the full legacy Marvel
 * Television run (Agents of S.H.I.E.L.D. S1-7 + the Slingshot digital series, the
 * Netflix Defenders Saga, Inhumans, Runaways, Cloak & Dagger, Helstrom, the WHIH
 * Newsfront viral series), the animated slate, and the full Sony SSU live-action
 * slate (Venom trilogy, Morbius, Madame Web, Kraven).
 */
export const chronology: ChronologyEntry[] = [
	{
		id: 'captain-america-the-first-avenger',
		order: 10,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: The First Avenger', year: 2011 },
		eraTag: 'WWII',
		source: 'Official timeline (1943-45)',
		rtSlug: 'm/captain_america_the_first_avenger'
	},
	{
		id: 'agent-carter-one-shot',
		order: 15,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Marvel One-Shot: Agent Carter', year: 2013, tmdbId: 211387 },
		eraTag: '1946',
		source: 'Marvel One-Shot (2013); set 1946, foreshadows S.H.I.E.L.D. & the Agent Carter series'
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
		source: 'Official timeline (1995)',
		rtSlug: 'm/captain_marvel'
	},
	{
		id: 'iron-man',
		order: 50,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Iron Man', year: 2008 },
		eraTag: 'Modern era',
		source: 'Official timeline (2010)',
		rtSlug: 'm/iron_man'
	},
	{
		id: 'iron-man-2',
		order: 60,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Iron Man 2', year: 2010 },
		source: 'Official timeline (2011)',
		rtSlug: 'm/iron_man_2'
	},
	{
		id: 'the-incredible-hulk',
		order: 70,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'The Incredible Hulk', year: 2008 },
		source: 'Official timeline (2011), concurrent with Iron Man 2',
		rtSlug: 'm/incredible_hulk'
	},
	{
		id: 'the-consultant',
		order: 72,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Marvel One-Shot: The Consultant', year: 2011, tmdbId: 76122 },
		source: 'Marvel One-Shot (2011); set after The Incredible Hulk — its Stark/Ross bar scene'
	},
	{
		id: 'a-funny-thing-happened-thors-hammer',
		order: 75,
		phase: 1,
		kind: 'movie',
		query: {
			type: 'movie',
			title: "Marvel One-Shot: A Funny Thing Happened on the Way to Thor's Hammer",
			year: 2011,
			tmdbId: 76535
		},
		source: "Marvel One-Shot (2011); Coulson en route to the New Mexico crater, just before Thor"
	},
	{
		id: 'thor',
		order: 80,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'Thor', year: 2011 },
		source: 'Official timeline (2011)',
		rtSlug: 'm/thor'
	},
	{
		id: 'the-avengers',
		order: 90,
		phase: 1,
		kind: 'movie',
		query: { type: 'movie', title: 'The Avengers', year: 2012 },
		eraTag: 'Battle of New York',
		source: 'Official timeline (2012)',
		rtSlug: 'm/marvels_the_avengers'
	},
	{
		id: 'item-47',
		order: 95,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Marvel One-Shot: Item 47', year: 2012, tmdbId: 119569 },
		eraTag: 'Battle of New York',
		source: 'Marvel One-Shot (2012); weeks after the Battle of New York, salvaged Chitauri tech'
	},
	{
		id: 'iron-man-3',
		order: 100,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Iron Man 3', year: 2013 },
		source: 'Official timeline (2012, Christmas)',
		rtSlug: 'm/iron_man_3'
	},
	{
		id: 'all-hail-the-king',
		order: 105,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Marvel One-Shot: All Hail the King', year: 2014, tmdbId: 253980 },
		source: 'Marvel One-Shot (2014); after Iron Man 3 — Trevor Slattery & the real Ten Rings'
	},
	{
		id: 'thor-the-dark-world',
		order: 110,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Thor: The Dark World', year: 2013 },
		source: 'Official timeline (2013)',
		rtSlug: 'm/thor_the_dark_world'
	},
	{
		id: 'captain-america-the-winter-soldier',
		order: 120,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: The Winter Soldier', year: 2014 },
		source: 'Official timeline (2014)',
		rtSlug: 'm/captain_america_the_winter_soldier'
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
		id: 'agents-of-shield-s2',
		order: 135,
		phase: 2,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.', year: 2013, season: 2 },
		source: 'Legacy ABC TV; aired 2014-15, Phase 2 release era'
	},
	{
		id: 'guardians-of-the-galaxy',
		order: 140,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Guardians of the Galaxy', year: 2014 },
		source: 'Official timeline (2014)',
		rtSlug: 'm/guardians_of_the_galaxy'
	},
	{
		id: 'guardians-of-the-galaxy-vol-2',
		order: 150,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Guardians of the Galaxy Vol. 2', year: 2017 },
		source: 'Official timeline (2014, months after Vol. 1)',
		rtSlug: 'm/guardians_of_the_galaxy_vol_2'
	},
	{
		id: 'i-am-groot-s1',
		order: 152,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'I Am Groot', year: 2022, season: 1, tmdbId: 232125 },
		eraTag: 'Baby Groot',
		source: 'Animated Disney+ shorts; Baby Groot, placed in-universe after Guardians Vol. 2'
	},
	{
		id: 'i-am-groot-s2',
		order: 154,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'I Am Groot', year: 2022, season: 2, tmdbId: 232125 },
		eraTag: 'Baby Groot',
		source: 'Animated Disney+ shorts; continues the Vol. 2-era Groot shorts'
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
		source: 'Official timeline (2015)',
		rtSlug: 'm/avengers_age_of_ultron'
	},
	{
		id: 'whih-newsfront',
		order: 185,
		phase: 2,
		kind: 'series-block',
		query: { type: 'tv', title: 'WHIH Newsfront', year: 2015, season: 1, tmdbId: 69069 },
		source: 'Viral MCU news web series (Christine Everhart); 2015, around Age of Ultron / Ant-Man'
	},
	{
		id: 'ant-man',
		order: 190,
		phase: 2,
		kind: 'movie',
		query: { type: 'movie', title: 'Ant-Man', year: 2015 },
		source: 'Official timeline (2015)',
		rtSlug: 'm/ant_man'
	},
	{
		id: 'captain-america-civil-war',
		order: 200,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: Civil War', year: 2016 },
		source: 'Official timeline (2016)',
		rtSlug: 'm/captain_america_civil_war'
	},
	{
		id: 'black-panther',
		order: 205,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Black Panther', year: 2018 },
		source: 'Official timeline (2016, ~one week after Civil War — precedes Homecoming)',
		rtSlug: 'm/black_panther_2018'
	},
	{
		id: 'black-widow',
		order: 202,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Black Widow', year: 2021 },
		source: 'Official timeline (2016, immediately after Civil War — precedes Black Panther)',
		rtSlug: 'm/black_widow_2021'
	},
	{
		id: 'spider-man-homecoming',
		order: 220,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Spider-Man: Homecoming', year: 2017 },
		source: 'Official timeline (2016, eight months after the Battle of New York salvage)',
		rtSlug: 'm/spider_man_homecoming'
	},
	{
		id: 'team-thor',
		order: 232,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Team Thor', year: 2016, tmdbId: 413279 },
		source: 'Marvel mockumentary short; Thor in Australia during Civil War (non-canon comedy)'
	},
	{
		id: 'team-thor-part-2',
		order: 234,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Team Thor: Part 2', year: 2017, tmdbId: 441829 },
		source: 'Marvel mockumentary short; Thor & roommate Darryl (non-canon comedy)'
	},
	{
		id: 'doctor-strange',
		order: 240,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Doctor Strange', year: 2016 },
		source: 'Official timeline (2016-2017)',
		rtSlug: 'm/doctor_strange_2016'
	},
	{
		id: 'thor-ragnarok',
		order: 250,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Thor: Ragnarok', year: 2017 },
		source: 'Official timeline (2017)',
		rtSlug: 'm/thor_ragnarok'
	},
	{
		id: 'team-darryl',
		order: 252,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Team Darryl', year: 2018, tmdbId: 505945 },
		source: 'Marvel mockumentary short; the Grandmaster on Earth after Ragnarok (non-canon comedy)'
	},
	{
		id: 'ant-man-and-the-wasp',
		order: 260,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Ant-Man and the Wasp', year: 2018 },
		source: 'Official timeline (2018, during Infinity War)',
		rtSlug: 'm/ant_man_and_the_wasp'
	},
	{
		id: 'avengers-infinity-war',
		order: 270,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Avengers: Infinity War', year: 2018 },
		eraTag: 'The Blip',
		source: 'Official timeline (2018)',
		rtSlug: 'm/avengers_infinity_war'
	},
	{
		id: 'avengers-endgame',
		order: 280,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Avengers: Endgame', year: 2019 },
		eraTag: 'The Blip / 2023',
		source: 'Official timeline (2018 & 2023 after 5-year jump)',
		rtSlug: 'm/avengers_endgame'
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
		source: 'Official timeline (2024)',
		rtSlug: 'm/shang_chi_and_the_legend_of_the_ten_rings'
	},
	{
		id: 'eternals',
		order: 350,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Eternals', year: 2021 },
		source: 'Official timeline (2024)',
		rtSlug: 'm/eternals'
	},
	{
		id: 'spider-man-far-from-home',
		order: 360,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Spider-Man: Far From Home', year: 2019 },
		source: 'Official timeline (2024, 8 months after Endgame)',
		rtSlug: 'm/spider_man_far_from_home'
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
		source: 'Official timeline (2024, after Far From Home)',
		rtSlug: 'm/spider_man_no_way_home'
	},
	{
		id: 'the-daily-bugle',
		order: 378,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'The Daily Bugle', year: 2019, tmdbId: 1716846 },
		source: 'MCU viral series (J.J. Jameson); bridges Far From Home\'s reveal into No Way Home'
	},
	{
		id: 'doctor-strange-multiverse-of-madness',
		order: 390,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Doctor Strange in the Multiverse of Madness', year: 2022 },
		source: 'Official timeline (2025, after No Way Home & WandaVision)',
		rtSlug: 'm/doctor_strange_in_the_multiverse_of_madness'
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
		source: 'Official timeline',
		rtSlug: 'm/thor_love_and_thunder'
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
		source: 'Disney+ special presentation',
		rtSlug: 'm/werewolf_by_night'
	},
	{
		id: 'black-panther-wakanda-forever',
		order: 450,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Black Panther: Wakanda Forever', year: 2022 },
		source: 'Official timeline',
		rtSlug: 'm/black_panther_wakanda_forever'
	},
	{
		id: 'guardians-holiday-special',
		order: 460,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'The Guardians of the Galaxy Holiday Special', year: 2022 },
		eraTag: 'Christmas',
		source: 'Disney+ special presentation',
		rtSlug: 'm/the_guardians_of_the_galaxy_holiday_special'
	},
	{
		id: 'agents-of-shield-s7',
		order: 462,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.', year: 2013, season: 7 },
		eraTag: 'Time travel',
		source: 'Legacy ABC TV; final season aired 2020, post-Phase-3 release gap'
	},
	{
		id: 'helstrom',
		order: 464,
		phase: 4,
		kind: 'series-block',
		query: { type: 'tv', title: 'Helstrom', year: 2020, season: 1, tmdbId: 88987 },
		eraTag: 'Marvel Television',
		source: 'Legacy Hulu; final Marvel Television series, 2020 release era'
	},
	{
		id: 'ant-man-quantumania',
		order: 470,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Ant-Man and the Wasp: Quantumania', year: 2023 },
		source: 'Official timeline (opens Phase 5)',
		rtSlug: 'm/ant_man_and_the_wasp_quantumania'
	},
	{
		id: 'guardians-of-the-galaxy-vol-3',
		order: 480,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Guardians of the Galaxy Vol. 3', year: 2023 },
		source: 'Official timeline',
		rtSlug: 'm/guardians_of_the_galaxy_vol_3'
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
		source: 'Official timeline (after Ms. Marvel)',
		rtSlug: 'm/the_marvels'
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
		source: 'Official timeline',
		rtSlug: 'm/deadpool_and_wolverine'
	},
	{
		id: 'captain-america-brave-new-world',
		order: 540,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Captain America: Brave New World', year: 2025 },
		source: 'Official timeline',
		rtSlug: 'm/captain_america_brave_new_world'
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
		id: 'daredevil-born-again-s2',
		order: 585,
		phase: 6,
		kind: 'series-block',
		query: { type: 'tv', title: 'Daredevil: Born Again', year: 2025, season: 2, tmdbId: 202555 },
		source: 'Official timeline; continues directly from S1, aired 2026 (Phase 6 era)'
	},
	{
		id: 'thunderbolts',
		order: 560,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Thunderbolts*', year: 2025 },
		source: 'Official timeline',
		rtSlug: 'm/thunderbolts'
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
		source: 'Official timeline (opens Phase 6)',
		rtSlug: 'm/the_fantastic_four_first_steps'
	},
	{
		id: 'wonder-man',
		order: 590,
		phase: 6,
		kind: 'series-block',
		query: { type: 'tv', title: 'Wonder Man', year: 2026, season: 1, tmdbId: 198178 },
		source: 'Marvel Studios Disney+ series; present-day, aired Jan 2026 (Phase 6 era)'
	},
	{
		id: 'visionquest',
		order: 595,
		phase: 6,
		kind: 'series-block',
		query: { type: 'tv', title: 'VisionQuest', year: 2026, season: 1, tmdbId: 213375 },
		source: 'Marvel Studios Disney+ series; WandaVision/Agatha follow-up, due Oct 2026 (Phase 6)'
	},

	/* ---- Legacy Marvel Television: Defenders Saga (Netflix) + ABC/Hulu/Freeform,
	   Phase 3 release era. Ordered by premiere date; no official in-universe dates,
	   so grouped at the tail of the Phase 3 band. ---- */
	{
		id: 'agents-of-shield-s3',
		order: 600,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.', year: 2013, season: 3 },
		source: 'Legacy ABC TV; aired 2015-16, Phase 3 release era'
	},
	{
		id: 'daredevil-s2',
		order: 605,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Daredevil', year: 2015, season: 2 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2016, Phase 3 release era'
	},
	{
		id: 'agents-of-shield-s4',
		order: 610,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.', year: 2013, season: 4 },
		source: 'Legacy ABC TV; aired 2016-17, Phase 3 release era'
	},
	{
		id: 'aos-slingshot',
		order: 612,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.: Slingshot', year: 2016, season: 1, tmdbId: 69088 },
		source: 'Legacy digital series; Yo-Yo tie-in to Agents of S.H.I.E.L.D. S4 (2016)'
	},
	{
		id: 'luke-cage-s1',
		order: 615,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Luke Cage', year: 2016, season: 1, tmdbId: 62126 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2016, Phase 3 release era'
	},
	{
		id: 'iron-fist-s1',
		order: 620,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Iron Fist', year: 2017, season: 1, tmdbId: 62127 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2017, Phase 3 release era'
	},
	{
		id: 'the-defenders',
		order: 625,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s The Defenders', year: 2017, season: 1, tmdbId: 62285 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; crossover miniseries, aired 2017'
	},
	{
		id: 'inhumans',
		order: 630,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Inhumans', year: 2017, season: 1, tmdbId: 68716 },
		source: 'Legacy ABC TV; aired 2017, Phase 3 release era'
	},
	{
		id: 'the-punisher-s1',
		order: 635,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s The Punisher', year: 2017, season: 1, tmdbId: 67178 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; Daredevil spin-off, aired 2017'
	},
	{
		id: 'runaways-s1',
		order: 640,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Runaways', year: 2017, season: 1, tmdbId: 67466 },
		source: 'Legacy Hulu; aired 2017, Phase 3 release era'
	},
	{
		id: 'agents-of-shield-s5',
		order: 645,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.', year: 2013, season: 5 },
		source: 'Legacy ABC TV; aired 2017-18, Phase 3 release era'
	},
	{
		id: 'jessica-jones-s2',
		order: 650,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Jessica Jones', year: 2015, season: 2 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2018, Phase 3 release era'
	},
	{
		id: 'cloak-and-dagger-s1',
		order: 655,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Cloak & Dagger', year: 2018, season: 1, tmdbId: 66190 },
		source: 'Legacy Freeform; aired 2018, Phase 3 release era'
	},
	{
		id: 'luke-cage-s2',
		order: 660,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Luke Cage', year: 2016, season: 2, tmdbId: 62126 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2018, Phase 3 release era'
	},
	{
		id: 'iron-fist-s2',
		order: 665,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Iron Fist', year: 2017, season: 2, tmdbId: 62127 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2018, Phase 3 release era'
	},
	{
		id: 'daredevil-s3',
		order: 670,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Daredevil', year: 2015, season: 3 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2018, Phase 3 release era'
	},
	{
		id: 'runaways-s2',
		order: 675,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Runaways', year: 2017, season: 2, tmdbId: 67466 },
		source: 'Legacy Hulu; aired 2018, Phase 3 release era'
	},
	{
		id: 'the-punisher-s2',
		order: 680,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s The Punisher', year: 2017, season: 2, tmdbId: 67178 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; aired 2019, Phase 3 release era'
	},
	{
		id: 'cloak-and-dagger-s2',
		order: 685,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Cloak & Dagger', year: 2018, season: 2, tmdbId: 66190 },
		source: 'Legacy Freeform; aired 2019, Phase 3 release era'
	},
	{
		id: 'agents-of-shield-s6',
		order: 690,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Agents of S.H.I.E.L.D.', year: 2013, season: 6 },
		source: 'Legacy ABC TV; aired 2019, Phase 3 release era'
	},
	{
		id: 'jessica-jones-s3',
		order: 695,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Jessica Jones', year: 2015, season: 3 },
		eraTag: 'Defenders Saga',
		source: 'Legacy Netflix; final Netflix season, aired 2019'
	},
	{
		id: 'runaways-s3',
		order: 700,
		phase: 3,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel\'s Runaways', year: 2017, season: 3, tmdbId: 67466 },
		source: 'Legacy Hulu; final season, aired 2019'
	},

	/* ---- Animation (alternate continuities), grouped by release Phase ---- */
	{
		id: 'what-if-s2',
		order: 740,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'What If...?', year: 2021, season: 2 },
		eraTag: 'Multiverse',
		source: 'Animated; aired Dec 2023, Phase 5 release era'
	},
	{
		id: 'what-if-s3',
		order: 745,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'What If...?', year: 2021, season: 3 },
		eraTag: 'Multiverse',
		source: 'Animated; final season, aired Dec 2024'
	},
	{
		id: 'x-men-97-s1',
		order: 750,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'X-Men \'97', year: 2024, season: 1 },
		eraTag: 'Alternate universe',
		source: 'Animated revival; separate continuity, grouped by Phase 5 release'
	},
	{
		id: 'x-men-97-s2',
		order: 752,
		phase: 6,
		kind: 'series-block',
		query: { type: 'tv', title: 'X-Men \'97', year: 2024, season: 2, tmdbId: 138502 },
		eraTag: 'Alternate universe',
		source: 'Animated; continues S1, aired 2026 (Phase 6 release era)'
	},
	{
		id: 'your-friendly-neighborhood-spider-man-s1',
		order: 755,
		phase: 5,
		kind: 'series-block',
		query: { type: 'tv', title: 'Your Friendly Neighborhood Spider-Man', year: 2025, season: 1 },
		eraTag: 'Alternate universe',
		source: 'Animated; aired 2025, Phase 5 release era'
	},
	{
		id: 'marvel-zombies',
		order: 760,
		phase: 6,
		kind: 'series-block',
		query: { type: 'tv', title: 'Marvel Zombies', year: 2025, season: 1 },
		eraTag: 'Alternate universe',
		source: 'Animated What If...? spin-off; aired 2025, Phase 6 release era'
	},
	{
		id: 'eyes-of-wakanda',
		order: 765,
		phase: 6,
		kind: 'series-block',
		query: { type: 'tv', title: 'Eyes of Wakanda', year: 2025, season: 1 },
		eraTag: 'Alternate continuity',
		source: 'Animated; aired 2025, Phase 6 release era'
	},

	/* ---- Sony tie-ins (the full SSU live-action slate — loose/contested canon,
	   grouped at the tail by release era) ---- */
	{
		id: 'venom',
		order: 800,
		phase: 3,
		kind: 'movie',
		query: { type: 'movie', title: 'Venom', year: 2018 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; loose MCU connection, grouped by release era',
		rtSlug: 'm/venom_2018'
	},
	{
		id: 'venom-let-there-be-carnage',
		order: 810,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Venom: Let There Be Carnage', year: 2021 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; mid-credits crosses into MCU (No Way Home)',
		rtSlug: 'm/venom_let_there_be_carnage'
	},
	{
		id: 'morbius',
		order: 820,
		phase: 4,
		kind: 'movie',
		query: { type: 'movie', title: 'Morbius', year: 2022 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; post-credits ties to Vulture via the No Way Home multiverse rift',
		rtSlug: 'm/morbius'
	},
	{
		id: 'madame-web',
		order: 825,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Madame Web', year: 2024, tmdbId: 634492 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; loosely connected, grouped by release era',
		rtSlug: 'm/madame_web'
	},
	{
		id: 'venom-the-last-dance',
		order: 830,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Venom: The Last Dance', year: 2024, tmdbId: 912649 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; closes the Venom trilogy, grouped by release era',
		rtSlug: 'm/venom_the_last_dance'
	},
	{
		id: 'kraven-the-hunter',
		order: 835,
		phase: 5,
		kind: 'movie',
		query: { type: 'movie', title: 'Kraven the Hunter', year: 2024, tmdbId: 539972 },
		eraTag: 'Sony tie-in',
		source: 'Sony SSU; final SSU film, grouped by release era',
		rtSlug: 'm/kraven_the_hunter'
	},

	/* ---- Announced, not yet released. No ratings / episodes yet — flagged
	   "upcoming" at runtime from the (future or missing) TMDB release date. ---- */
	{
		id: 'spider-man-brand-new-day',
		order: 900,
		phase: 6,
		kind: 'movie',
		query: { type: 'movie', title: 'Spider-Man: Brand New Day', year: 2026, tmdbId: 969681 },
		source: 'Announced theatrical release'
	},
	{
		id: 'avengers-doomsday',
		order: 910,
		phase: 6,
		kind: 'movie',
		query: { type: 'movie', title: 'Avengers: Doomsday', year: 2026, tmdbId: 1003596 },
		source: 'Announced theatrical release'
	},
	{
		id: 'avengers-secret-wars',
		order: 920,
		phase: 6,
		kind: 'movie',
		query: { type: 'movie', title: 'Avengers: Secret Wars', year: 2027, tmdbId: 1003598 },
		source: 'Announced theatrical release'
	}
];
