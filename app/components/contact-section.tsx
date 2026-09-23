"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { DayPicker } from "react-day-picker";
import { enGB, srLatn } from "react-day-picker/locale";
import {
  getAvailableTimeSlots,
  getEarliestBookableDate,
  isBookableSlot,
  isGuestCountValid,
  MAX_GUESTS,
  MIN_GUESTS,
} from "../lib/booking-rules";
import {
  instagramLink,
  mailtoLink,
  telLink,
  VENUE,
} from "../lib/contact";
import { toE164 } from "../lib/phone";
import { ScrollReveal } from "./scroll-reveal";
import { useLanguage } from "./language-provider";

type ContactSectionProps = {
  id?: string;
  pageMode?: boolean;
};

type FormTab = "inquiry" | "reservation";

type FormErrors = Partial<
  Record<
    | "name"
    | "phone"
    | "message"
    | "date"
    | "time"
    | "guests"
    | "celebration",
    string
  >
>;

const MESSAGE_MAX = 500;
const CHAR_COUNTER_THRESHOLD = 450;

function CalendarIcon() {
  return (
    <svg
      className="contact-datetime-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3.75"
        y="5.25"
        width="16.5"
        height="15"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.75 9.75h16.5M8 3.5v3.5M16 3.5v3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 3.5l9 9M12.5 3.5l-9 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ContactSection({ id, pageMode = false }: ContactSectionProps) {
  const { copy, locale } = useLanguage();
  const [tab, setTab] = useState<FormTab>("inquiry");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHour, setSelectedHour] = useState<number | "">("");
  const [guests, setGuests] = useState("");
  const [celebration, setCelebration] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [now, setNow] = useState(() => new Date());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [inquiryCardHeight, setInquiryCardHeight] = useState<number>();
  const infoCardRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const pickerTriggerRef = useRef<HTMLButtonElement>(null);
  const pickerId = useId();

  const dayPickerLocale = locale === "en" ? enGB : srLatn;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);


  useEffect(() => {
    if (tab !== "inquiry") return;
    const card = infoCardRef.current;
    if (!card) return;
    const observer = new ResizeObserver(() =>
      setInquiryCardHeight(card.offsetHeight),
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [tab]);

  const closePicker = useCallback((restoreFocus = false) => {
    setPickerOpen(false);
    if (restoreFocus) pickerTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) closePicker();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePicker(true);
    };

    const isSheet = window.matchMedia("(max-width: 639px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (isSheet) document.body.style.overflow = "hidden";

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
      if (isSheet) document.body.style.overflow = previousOverflow;
    };
  }, [pickerOpen, closePicker]);

  const earliestDate = useMemo(() => getEarliestBookableDate(now), [now]);
  const timeSlots = useMemo(
    () => (selectedDate ? getAvailableTimeSlots(selectedDate, now) : []),
    [selectedDate, now],
  );

  const dateTimeLabel = useMemo(() => {
    if (!selectedDate) return null;
    const dateText = new Intl.DateTimeFormat(
      locale === "en" ? "en-GB" : "sr-Latn",
      { weekday: "short", day: "numeric", month: "long" },
    ).format(selectedDate);
    if (selectedHour === "") return dateText;
    return `${dateText} · ${String(selectedHour).padStart(2, "0")}:00`;
  }, [selectedDate, selectedHour, locale]);

  const resetTabFields = () => {
    setMessage("");
    setSelectedDate(undefined);
    setSelectedHour("");
    setGuests("");
    setCelebration("");
    setErrors({});
    setPickerOpen(false);
  };

  const switchTab = (next: FormTab) => {
    if (next === tab && status !== "success") return;
    setTab(next);
    resetTabFields();
    setStatus("idle");
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) nextErrors.name = copy.validationRequired;
    const phoneE164 = toE164(phone);
    if (!phoneE164) nextErrors.phone = copy.validationPhone;

    if (tab === "inquiry") {
      if (!message.trim()) nextErrors.message = copy.validationRequired;
      else if (message.length > MESSAGE_MAX) {
        nextErrors.message = copy.validationMessageLength;
      }
    } else {
      if (!selectedDate) nextErrors.date = copy.validationDate;
      else if (
        selectedHour === "" ||
        !isBookableSlot(selectedDate, selectedHour, now)
      ) {
        nextErrors.time = copy.validationTime;
      }

      const guestCount = Number(guests);
      if (!guests.trim() || !isGuestCountValid(guestCount)) {
        nextErrors.guests = copy.validationGuests;
      }

      if (!celebration.trim()) nextErrors.celebration = copy.validationRequired;
      else if (celebration.length > MESSAGE_MAX) {
        nextErrors.celebration = copy.validationMessageLength;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const phoneE164 = toE164(phone) ?? "";

    if (tab === "inquiry") {
      return {
        type: "inquiry" as const,
        name: name.trim(),
        phone: phoneE164,
        message: message.trim(),
      };
    }

    const dateKey = selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : "";
    const timeLabel =
      selectedHour === "" ? "" : `${String(selectedHour).padStart(2, "0")}:00`;

    return {
      type: "reservation" as const,
      name: name.trim(),
      phone: phoneE164,
      date: dateKey,
      time: timeLabel,
      guests: Number(guests),
      celebration: celebration.trim(),
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading" || status === "success") return;
    if (!validate()) return;

    setStatus("loading");
    void buildPayload();

    window.setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  const longText = tab === "inquiry" ? message : celebration;
  const showCharCounter = longText.length >= CHAR_COUNTER_THRESHOLD;

  const contactFields = (
    <>
      <div className="contact-field">
        <label className="contact-label" htmlFor="contact-name">
          {copy.fieldName}
        </label>
        <input
          id="contact-name"
          className="contact-input"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={copy.placeholderName}
        />
        {errors.name ? <p className="contact-error">{errors.name}</p> : null}
      </div>

      <div className="contact-field">
        <label className="contact-label" htmlFor="contact-phone">
          {copy.fieldPhone}
        </label>
        <input
          id="contact-phone"
          className="contact-input"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder={copy.placeholderPhone}
        />
        {errors.phone ? <p className="contact-error">{errors.phone}</p> : null}
      </div>
    </>
  );

  return (
    <section
      id={id}
      className={`contact-section bg-anthracite px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28${
        pageMode ? " contact-section--page" : " gold-rule"
      }`}
      aria-labelledby="contact-heading"
    >
      <ScrollReveal className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="site-kicker">{copy.contactKicker}</p>
          <h2
            id="contact-heading"
            className="mt-5 font-heading text-3xl font-medium leading-tight text-ivory sm:text-4xl md:text-[2.75rem] md:leading-tight"
          >
            {copy.contactHeading}
          </h2>
        </div>

        <div
          className={`contact-grid mt-12 sm:mt-14${
            tab === "reservation" ? " is-reservation" : ""
          }`}
        >
          <div className="contact-form-col">
            <div className="contact-form-panel">
              <div
                className="contact-tabs"
                role="tablist"
                aria-label={copy.contactKicker}
              >
                <button
                  type="button"
                  role="tab"
                  className={`contact-tab${tab === "inquiry" ? " is-active" : ""}`}
                  aria-selected={tab === "inquiry"}
                  onClick={() => switchTab("inquiry")}
                >
                  {copy.tabInquiry}
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`contact-tab${tab === "reservation" ? " is-active" : ""}`}
                  aria-selected={tab === "reservation"}
                  onClick={() => switchTab("reservation")}
                >
                  {copy.tabReservation}
                </button>
              </div>

              {status === "success" ? (
                <p className="contact-success" role="status">
                  {copy.submitSuccess}
                </p>
              ) : (
                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {tab === "reservation" ? (
                    <p className="contact-disclaimer">
                      {copy.reservationDisclaimer}
                    </p>
                  ) : null}

                  {contactFields}

                  {tab === "inquiry" ? (
                    <div className="contact-field">
                      <label className="contact-label" htmlFor="contact-message">
                        {copy.fieldMessage}
                      </label>
                      <textarea
                        id="contact-message"
                        className="contact-textarea"
                        rows={5}
                        maxLength={MESSAGE_MAX}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder={copy.placeholderMessage}
                      />
                      {showCharCounter ? (
                        <p className="contact-char-counter" aria-live="polite">
                          {copy.charCounter(message.length, MESSAGE_MAX)}
                        </p>
                      ) : null}
                      {errors.message ? (
                        <p className="contact-error">{errors.message}</p>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <div className="contact-reservation-row">
                        <div
                          className="contact-field contact-datetime"
                          ref={pickerRef}
                        >
                          <span
                            className="contact-label"
                            id={`${pickerId}-label`}
                          >
                            {copy.fieldDateTime}
                          </span>
                          <button
                            ref={pickerTriggerRef}
                            type="button"
                            className={`contact-input contact-datetime-trigger${
                              pickerOpen ? " is-open" : ""
                            }`}
                            aria-haspopup="dialog"
                            aria-expanded={pickerOpen}
                            aria-controls={pickerId}
                            aria-labelledby={`${pickerId}-label ${pickerId}-value`}
                            onClick={() => setPickerOpen((open) => !open)}
                          >
                            <span
                              id={`${pickerId}-value`}
                              className={
                                dateTimeLabel ? undefined : "is-placeholder"
                              }
                            >
                              {dateTimeLabel ?? copy.placeholderDateTime}
                            </span>
                            <CalendarIcon />
                          </button>

                          {pickerOpen ? (
                            <div
                              id={pickerId}
                              className="contact-datetime-popover"
                              role="dialog"
                              aria-labelledby={`${pickerId}-label`}
                            >
                              <div className="contact-datetime-head">
                                <span className="contact-label">
                                  {selectedDate
                                    ? copy.selectTime
                                    : copy.selectDate}
                                </span>
                                <button
                                  type="button"
                                  className="contact-datetime-close"
                                  aria-label={copy.pickerClose}
                                  onClick={() => closePicker(true)}
                                >
                                  <CloseIcon />
                                </button>
                              </div>

                              {!selectedDate ? (
                                <p className="contact-picker-rule">
                                  {copy.pickerTimeRule}
                                </p>
                              ) : null}

                              <div className="contact-calendar-inline">
                                <DayPicker
                                  mode="single"
                                  locale={dayPickerLocale}
                                  selected={selectedDate}
                                  onSelect={(date) => {
                                    setSelectedDate(date);
                                    setSelectedHour("");
                                  }}
                                  disabled={{ before: earliestDate }}
                                  weekStartsOn={1}
                                  defaultMonth={selectedDate ?? earliestDate}
                                />
                              </div>

                              {selectedDate ? (
                                timeSlots.length > 0 ? (
                                  <div
                                    className="contact-time-grid"
                                    role="group"
                                    aria-label={copy.fieldTime}
                                  >
                                    {timeSlots.map((slot) => (
                                      <button
                                        key={slot.hour}
                                        type="button"
                                        className={`contact-time-pill${
                                          selectedHour === slot.hour
                                            ? " is-active"
                                            : ""
                                        }`}
                                        aria-pressed={selectedHour === slot.hour}
                                        onClick={() => {
                                          setSelectedHour(slot.hour);
                                          setErrors((prev) => ({
                                            ...prev,
                                            date: undefined,
                                            time: undefined,
                                          }));
                                          closePicker(true);
                                        }}
                                      >
                                        {slot.label}
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="contact-time-hint">
                                    {copy.noTimeSlots}
                                  </p>
                                )
                              ) : null}
                            </div>
                          ) : null}

                          {errors.date || errors.time ? (
                            <p className="contact-error">
                              {errors.date ?? errors.time}
                            </p>
                          ) : null}
                        </div>

                        <div className="contact-field">
                          <label
                            className="contact-label"
                            htmlFor="contact-guests"
                          >
                            {copy.fieldGuests}
                          </label>
                          <input
                            id="contact-guests"
                            className="contact-input"
                            type="number"
                            min={MIN_GUESTS}
                            max={MAX_GUESTS}
                            inputMode="numeric"
                            value={guests}
                            onChange={(event) => setGuests(event.target.value)}
                            placeholder={copy.placeholderGuests}
                          />
                          {errors.guests ? (
                            <p className="contact-error">{errors.guests}</p>
                          ) : null}
                        </div>
                      </div>

                      <div className="contact-field">
                        <label
                          className="contact-label"
                          htmlFor="contact-celebration"
                        >
                          {copy.fieldCelebration}
                        </label>
                        <textarea
                          id="contact-celebration"
                          className="contact-textarea"
                          rows={3}
                          maxLength={MESSAGE_MAX}
                          value={celebration}
                          onChange={(event) =>
                            setCelebration(event.target.value)
                          }
                          placeholder={copy.placeholderCelebration}
                        />
                        {showCharCounter ? (
                          <p className="contact-char-counter" aria-live="polite">
                            {copy.charCounter(celebration.length, MESSAGE_MAX)}
                          </p>
                        ) : null}
                        {errors.celebration ? (
                          <p className="contact-error">{errors.celebration}</p>
                        ) : null}
                      </div>
                    </>
                  )}

                  <div className="contact-form-footer">
                    <button
                      type="submit"
                      className="site-cta-pill site-cta-pill-fill contact-submit"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? copy.submitting : copy.submit}
                    </button>
                  </div>

                  {status === "error" ? (
                    <p
                      className="contact-error contact-error-block"
                      role="alert"
                    >
                      {copy.submitError}
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>

          <div className="contact-info-col">
            <div
              ref={infoCardRef}
              className="contact-info-card"
              style={
                tab === "reservation" && inquiryCardHeight
                  ? { minHeight: inquiryCardHeight }
                  : undefined
              }
            >
              <div className="contact-info-row">
                <span className="contact-info-label">{copy.addressLabel}</span>
                <div className="contact-info-value">
                  <address className="contact-address not-italic">
                    {VENUE.addressLine1}
                    <br />
                    {VENUE.addressLine2}
                  </address>
                  <div className="contact-action-pills">
                    <a
                      href={VENUE.googleMapsUrl}
                      className="contact-action-pill"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {copy.mapCta}
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-info-row">
                <span className="contact-info-label">{copy.hoursLabel}</span>
                <p className="contact-info-value">{copy.hoursValue}</p>
              </div>

              <div className="contact-info-row">
                <span className="contact-info-label">{copy.phoneLabel}</span>
                <div className="contact-info-value">
                  <a
                    href={telLink()}
                    className="contact-info-link contact-phone-display"
                  >
                    {VENUE.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="contact-info-row">
                <span className="contact-info-label">{copy.emailLabel}</span>
                <a href={mailtoLink()} className="contact-info-link">
                  {VENUE.email}
                </a>
              </div>

              <div className="contact-info-row">
                <span className="contact-info-label">
                  {copy.instagramLabel}
                </span>
                <a
                  href={instagramLink()}
                  className="contact-info-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{VENUE.instagramHandle}
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
