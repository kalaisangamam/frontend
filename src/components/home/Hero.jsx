import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiPlayCircle,
  FiZap,
  FiShield,
  FiSun,
  FiActivity,
  FiTarget,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { publicService } from "../../services/publicService";
import academyImage from "../../assets/images/hero/banner.png";

// clipped-corner "premium frame" shape, used for the mobile floating badge only
const FRAME_CLIP =
  "polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px)";

// discipline tags with icons — swap for real data from publicService if/when available
const DISCIPLINES = [
  { icon: FiZap, label: "Silambam" },
  { icon: FiShield, label: "Karate" },
  { icon: FiSun, label: "Yoga" },
  { icon: FiActivity, label: "Skating" },
  { icon: FiTarget, label: "Archery" },
  { icon: FiBookOpen, label: "Hindi" },
];

const formatEventDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

const EventQueueControls = ({
  activeIndex,
  events,
  onSelect,
  compact = false,
}) => {
  if (events.length < 2) return null;

  return (
    <div
      className={`flex items-center ${
        compact ? "justify-between" : "justify-end"
      } gap-2`}
    >
      {!compact && (
        <span className="mr-1 font-mono text-[0.62rem] tracking-[0.16em] text-parchment-300/45">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(events.length).padStart(2, "0")}
        </span>
      )}

      <button
        type="button"
        onClick={() =>
          onSelect((activeIndex - 1 + events.length) % events.length)
        }
        aria-label="Show previous event"
        className="grid h-10 w-10 place-items-center border border-parchment-100/15 text-parchment-300 transition hover:border-brass-500/60 hover:text-brass-400"
      >
        <FiChevronLeft />
      </button>

      <button
        type="button"
        onClick={() => onSelect((activeIndex + 1) % events.length)}
        aria-label="Show next event"
        className="grid h-10 w-10 place-items-center border border-parchment-100/15 text-parchment-300 transition hover:border-brass-500/60 hover:text-brass-400"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

const FlashNewsCard = ({ announcement }) => {
  const isCommonNews =
    announcement.branch?.trim().toLowerCase() === "common";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-brass-500/30 bg-ink-900/90 px-4 py-3 shadow-[0_16px_36px_-22px_rgba(224,133,50,0.85)] backdrop-blur-md">
      <span
        aria-label="Flash News"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-brass-500/30 bg-ink-900/90 text-brass-400"
      >
        <FiZap aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        {!isCommonNews && (
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brass-400">
            <FiMapPin aria-hidden="true" className="text-xs" />
            <span>{announcement.branch}</span>
          </div>
        )}

        <marquee
          className="block w-full text-sm leading-relaxed text-parchment-100"
          behavior="scroll"
          direction="left"
          scrollamount="3"
          aria-label={`Flash News: ${announcement.description}`}
        >
          {announcement.description}
        </marquee>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [flashNews, setFlashNews] = useState(null);

  useEffect(() => {
    publicService
      .getEvents()
      .then(({ data }) =>
        setEvents(Array.isArray(data.data) ? data.data : [])
      )
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    publicService
      .getHeroAnnouncement()
      .then(({ data }) => {
        const announcement = data?.data;

        if (announcement) {
          setFlashNews({
            branch: announcement.branches?.name || "Common",
            description:
              announcement.description || announcement.title,
          });

          return;
        }

        return publicService.getSiteSettings().then(({ data: settings }) => {
          const description = String(
            settings?.data?.flash_news || ""
          ).trim();

          setFlashNews(
            description
              ? { branch: "Common", description }
              : null
          );
        });
      })
      .catch(() => setFlashNews(null));
  }, []);

  useEffect(() => {
    if (activeEventIndex >= events.length) {
      setActiveEventIndex(0);
    }
  }, [activeEventIndex, events.length]);

  const heroEvent = events[activeEventIndex] || null;
  const eventNumber = String(activeEventIndex + 1).padStart(2, "0");

  const navigateToPrograms = () => {
    navigate("/programs");
  };

  const navigateToContact = () => {
    navigate("/contact");
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-16 lg:pt-20 lg:pr-12 lg:pb-0"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-brass-500/10 blur-3xl" />

        <div className="absolute top-40 -right-40 h-[26rem] w-[26rem] rounded-full bg-maroon-500/10 blur-3xl" />
      </div>

      {/* =========================================================
          MOBILE FLASH NEWS
      ========================================================== */}
      {flashNews && (
        <div className="mx-auto mb-4 w-[min(100%-2rem,34rem)] lg:hidden">
          <FlashNewsCard announcement={flashNews} />
        </div>
      )}

      <div className="relative lg:min-h-[42rem]">
        {/* =======================================================
            DESKTOP FLASH NEWS
        ======================================================== */}
        {flashNews && (
          <div className="absolute left-1/2 top-0 z-30 hidden w-[min(34rem,calc(100%-3rem))] -translate-x-1/2 lg:block">
            <FlashNewsCard announcement={flashNews} />
          </div>
        )}

        {/* =======================================================
            DESKTOP BANNER
        ======================================================== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-y-0 right-0 z-20 hidden w-[58%] overflow-hidden rounded-l-[2.5rem] lg:block"
        >
          <img
            src={academyImage}
            alt="Kalai Sangamam academy"
            className="absolute inset-0 h-full w-full object-cover object-top"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 16%)",
              maskImage:
                "linear-gradient(to right, transparent, black 16%)",
            }}
          />

          <div className="absolute inset-x-6 bottom-6 z-10 flex items-center justify-between gap-6 rounded-2xl border border-parchment-100/10 bg-ink-900/80 p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)] backdrop-blur-md">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-brass-500/30 bg-brass-500/10 text-brass-500">
                <FiCalendar />
              </span>

              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brass-500">
                  {heroEvent
                    ? `Featured Event ${eventNumber}`
                    : "Flash News"}
                </p>

                <h4 className="mt-1 truncate font-display text-lg leading-tight text-parchment-100">
                  {heroEvent ? heroEvent.title : "No featured event"}
                </h4>

                <p className="mt-1 truncate text-xs text-parchment-300/60">
                  {heroEvent
                    ? `${formatEventDate(heroEvent.event_date) || "Date to be announced"} • Dindigul`
                    : "Check back soon for upcoming academy updates."}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <EventQueueControls
                activeIndex={activeEventIndex}
                events={events}
                onSelect={setActiveEventIndex}
              />

              <button
                onClick={() =>
                  navigate(
                    heroEvent
                      ? `/events#event-${heroEvent.id}`
                      : "/events"
                  )
                }
                className="flex items-center gap-2 px-3 py-2 font-display text-sm font-semibold uppercase tracking-wide text-parchment-100 transition-colors hover:text-brass-400"
              >
                View All Events{" "}
                <FiArrowRight className="text-brass-500" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* =======================================================
            HERO CONTENT
        ======================================================== */}
        <div className="container-xl relative z-10 lg:flex lg:h-full lg:min-h-[42rem] lg:items-center">
          {/* LEFT: hero text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative lg:w-[46%]"
          >
            {/* ===================================================
                HEADING
            ==================================================== */}
            <h1 className="text-center font-display text-[1.8rem] font-bold leading-[1.2] tracking-[0.03em] text-parchment-100 sm:text-left sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="text-xl lg:hidden">
                Tradition.{" "}
                <span className="text-brass-400">
                  Discipline.
                </span>{" "}
                Champions.
              </span>

              <span className="hidden lg:inline">
                Tradition.
                <br />
                <span className="text-brass-400">
                  Discipline.
                </span>
                <br />
                Champions.
              </span>
            </h1>

            {/* ===================================================
                MOBILE HERO IMAGE
            ==================================================== */}
            <motion.figure
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto mt-4 w-full max-w-[28rem] overflow-hidden border border-brass-500/25 bg-ink-800/70 p-2 shadow-[0_28px_70px_-38px_rgba(224,133,50,0.7)] lg:hidden"
            >
              <motion.img
                src={academyImage}
                alt="Kalai Sangamam martial arts training"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.15,
                  ease: "easeOut",
                }}
                className="aspect-[16/9] w-full object-cover object-top"
              />

              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 80, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute left-0 top-0 z-10 h-px bg-brass-500"
              />
            </motion.figure>

            {/* ===================================================
                TAGLINE
            ==================================================== */}
            <p className="mt-3 text-center font-display text-base font-semibold tracking-[0.03em] text-brass-400 sm:text-left sm:text-lg">
              Where Tradition Builds Champions.
            </p>

            {/* ===================================================
                DESKTOP DESCRIPTION
            ==================================================== */}
            <p className="mt-6 hidden max-w-xl text-justify text-base leading-relaxed text-slate-300 lg:block lg:text-lg">
              We blend tradition, disciplined training, and modern
              excellence to build strength, focus, confidence, and
              character through Yoga, Skating, Karate, Silambam,
              Archery & Hindi.
            </p>

            {/* ===================================================
                TAMIL AFFIRMATION
            ==================================================== */}
            <div className="mt-0 border-brass-500/20 pt-6 sm:mt-4 sm:border-t">
              <p className="font-display text-base leading-relaxed text-parchment-100 sm:text-lg">
                கலையை கற்று. ஒழுக்கத்தை வளர்த்து.
                <br className="hidden sm:block" />
                உன் வெற்றியை உருவாக்கு.
              </p>

              <p className="mt-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brass-500/80">
                Kalai Sangamam &mdash; TRAIN. DISCIPLINE. EXCEL.
              </p>
            </div>

            {/* ===================================================
                HERO CTA BUTTONS
                MOBILE:
                - Same row
                - Equal width
                - Smaller text
                - Smaller padding
                DESKTOP:
                - Existing larger buttons
            ==================================================== */}
            <div className="mt-6 flex w-full flex-row gap-2 sm:mt-9 sm:gap-4">
              {/* Explore Programs */}
              <button
                type="button"
                onClick={navigateToPrograms}
                className="
                  btn-primary
                  flex
                  w-1/2
                  items-center
                  justify-center
                  gap-1
                  whitespace-nowrap
                  !px-2
                  !py-2.5
                  text-[10px]
                  leading-none
                  sm:w-auto
                  sm:flex-none
                  sm:!px-6
                  sm:!py-3
                  sm:text-sm
                "
              >
                <span>Explore Programs</span>
                <FiArrowRight className="shrink-0 text-xs sm:text-sm" />
              </button>

              {/* Join a Class */}
              <button
                type="button"
                onClick={navigateToContact}
                className="
                  btn-secondary
                  flex
                  w-1/2
                  items-center
                  justify-center
                  gap-1
                  whitespace-nowrap
                  !px-2
                  !py-2.5
                  text-[10px]
                  leading-none
                  sm:w-auto
                  sm:flex-none
                  sm:!px-6
                  sm:!py-3
                  sm:text-sm
                "
              >
                <FiPlayCircle className="shrink-0 text-xs sm:text-sm" />
                <span>Join a Class</span>
              </button>
            </div>
          </motion.div>

          {/* =====================================================
              MOBILE EVENT QUEUE
          ====================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto mt-6 w-[94%] max-w-[24rem] border border-parchment-100/15 bg-ink-800/80 p-4 shadow-[0_16px_50px_-32px_rgba(224,133,50,0.4)] backdrop-blur-sm lg:hidden"
          >
            <span className="absolute left-0 top-0 h-px w-14 bg-brass-500" />

            {heroEvent ? (
              <>
                <div className="flex items-center justify-between border-b border-parchment-100/10 pb-3">
                  <span className="flex items-center gap-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-brass-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-brass-500 shadow-[0_0_10px_rgba(224,133,50,0.8)]" />
                    Featured Event
                  </span>

                  <span className="font-mono text-[0.68rem] text-parchment-300/50">
                    {eventNumber}
                  </span>
                </div>

                <div className="flex items-center gap-4 py-4">
                  {/* Event Image */}
                  <span className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden border border-brass-500/25 bg-ink-900 text-brass-500">
                    {heroEvent.image_url ? (
                      <img
                        src={heroEvent.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiCalendar className="text-lg" />
                    )}
                  </span>

                  {/* Event Content */}
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-parchment-300/55">
                      Upcoming Event
                    </p>

                    <h3 className="truncate font-display text-xl leading-tight text-parchment-100">
                      {heroEvent.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-parchment-300/65">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="shrink-0 text-brass-500" />

                        <span>
                          {formatEventDate(heroEvent.event_date) ||
                            "Date to be announced"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <FiMapPin className="shrink-0 text-brass-500" />

                        <span>Dindigul</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-parchment-100/10 pt-4">
                  <EventQueueControls
                    activeIndex={activeEventIndex}
                    events={events}
                    onSelect={setActiveEventIndex}
                    compact
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/events#event-${heroEvent.id}`)
                  }
                  className="flex w-full items-center justify-between pt-5 font-display text-sm font-semibold uppercase tracking-wide text-parchment-100 transition-colors hover:text-brass-400"
                >
                  <span>View Event</span>
                  <FiArrowRight className="text-brass-500" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-parchment-100/10 pb-5">
                  <span className="flex items-center gap-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brass-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-brass-500 shadow-[0_0_12px_rgba(224,133,50,0.8)]" />
                    Featured Event
                  </span>

                  <span className="font-mono text-xs text-parchment-300/50">
                    01
                  </span>
                </div>

                <div className="grid gap-5 py-7 sm:grid-cols-[3.25rem_1fr]">
                  <span className="grid h-12 w-12 place-items-center border border-brass-500/25 text-brass-500">
                    <FiCalendar className="text-base" />
                  </span>

                  <div>
                    <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-parchment-300/55">
                      Flash News
                    </p>

                    <h3 className="font-display text-2xl leading-[1.05] text-parchment-100 lg:text-3xl">
                      No featured event
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-parchment-300/60">
                      Check back soon for upcoming academy updates.
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;