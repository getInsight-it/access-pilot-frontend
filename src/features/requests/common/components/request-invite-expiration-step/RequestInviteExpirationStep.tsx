import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@common/external/ui/popover.tsx";
import "./request-invite-expiration-step.scss";

interface RequestInviteExpirationStepProps {
  value: string;
  errorMessage?: string | null;
  onChange: (value: string) => void;
}

const WEEKDAY_LABELS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
const DEFAULT_EXPIRATION_HOUR = "23";
const DEFAULT_EXPIRATION_MINUTE = "59";

const getDateFromValue = (value: string) => {
  if (!value) {
    return null;
  }

  const normalizedValue = value.includes("T")
    ? value
    : `${value}T00:00:00`;
  const parsedDate = parseISO(normalizedValue);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getTimeFieldsFromValue = (value: string) => {
  const date = getDateFromValue(value);

  if (!date) {
    return {
      hour: DEFAULT_EXPIRATION_HOUR,
      minute: DEFAULT_EXPIRATION_MINUTE
    };
  }

  return {
    hour: format(date, "HH"),
    minute: format(date, "mm")
  };
};

const buildExpirationValue = (date: Date, hour: string, minute: string) => (
  `${format(date, "yyyy-MM-dd")}T${hour}:${minute}`
);

const isValidTimeValue = (value: string, maxValue: number) => {
  const parsedValue = Number.parseInt(value, 10);

  return Number.isInteger(parsedValue) && parsedValue >= 0 && parsedValue <= maxValue;
};

const isCompleteTimeValue = (value: string, maxValue: number) => (
  value.length === 2 && isValidTimeValue(value, maxValue)
);

const formatValueForDisplay = (value: string) => {
  const date = getDateFromValue(value);

  if (!date) {
    return "Selecione data e horário";
  }

  return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
};

export const RequestInviteExpirationStep: React.FC<RequestInviteExpirationStepProps> = ({
  value,
  errorMessage,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = getDateFromValue(value);
  const [timeFields, setTimeFields] = useState(() => getTimeFieldsFromValue(value));
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(selectedDate || new Date()));
  const today = startOfDay(new Date());

  useEffect(() => {
    setVisibleMonth(startOfMonth(getDateFromValue(value) || new Date()));
  }, [value]);

  useEffect(() => {
    setTimeFields(getTimeFieldsFromValue(value));
  }, [value]);

  const calendarDays = useMemo(() => {
    const calendarStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
    const days: Date[] = [];

    let currentDay = calendarStart;
    while (currentDay <= calendarEnd) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [visibleMonth]);

  const handleTimeFieldChange = (field: "hour" | "minute", nextValue: string) => {
    const sanitizedValue = nextValue.replace(/\D/g, "").slice(0, 2);
    const nextFields = {
      ...timeFields,
      [field]: sanitizedValue
    };

    setTimeFields(nextFields);

    if (!selectedDate) {
      return;
    }

    const hasValidHour = isCompleteTimeValue(nextFields.hour, 23);
    const hasValidMinute = isCompleteTimeValue(nextFields.minute, 59);

    if (hasValidHour && hasValidMinute) {
      onChange(buildExpirationValue(selectedDate, nextFields.hour, nextFields.minute));
    }
  };

  const handleTimeFieldBlur = (field: "hour" | "minute") => {
    const fallbackValue = field === "hour"
      ? DEFAULT_EXPIRATION_HOUR
      : DEFAULT_EXPIRATION_MINUTE;
    const maxValue = field === "hour" ? 23 : 59;
    const currentValue = timeFields[field];
    const normalizedValue = isValidTimeValue(currentValue, maxValue)
      ? currentValue.padStart(2, "0")
      : fallbackValue;
    const nextFields = {
      ...timeFields,
      [field]: normalizedValue
    };

    setTimeFields(nextFields);

    if (selectedDate) {
      onChange(buildExpirationValue(selectedDate, nextFields.hour, nextFields.minute));
    }
  };

  return (
    <div className="request-invite-expiration-step">
      <div className="request-invite-expiration-step__intro">
        <div className="request-invite-expiration-step__icon-box">
          <CalendarDays className="request-invite-expiration-step__icon" />
        </div>

        <div className="request-invite-expiration-step__intro-content">
          <h4 className="request-invite-expiration-step__title">Validade do convite</h4>
          <p className="request-invite-expiration-step__description">
            Escolha a data e o horário limite até quando o convite poderá ser utilizado pelos destinatários.
          </p>
        </div>
      </div>

      <div className="request-invite-expiration-step__field">
        <label className="request-invite-expiration-step__label" htmlFor="invite-expiration-trigger">
          Data de expiração <span className="request-invite-expiration-step__required">*</span>
        </label>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              id="invite-expiration-trigger"
              type="button"
              className={`app-input request-invite-expiration-step__trigger${errorMessage ? " request-invite-expiration-step__trigger--error" : ""}${value ? " request-invite-expiration-step__trigger--selected" : ""}`}
            >
              <span className="request-invite-expiration-step__trigger-content">
                <CalendarDays className="request-invite-expiration-step__trigger-icon" />
                <span className="request-invite-expiration-step__trigger-label">
                  {formatValueForDisplay(value)}
                </span>
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent align="start" className="request-invite-expiration-step__popover">
            <div className="request-invite-expiration-step__calendar">
              <div className="request-invite-expiration-step__calendar-header">
                <button
                  type="button"
                  className="request-invite-expiration-step__calendar-nav"
                  onClick={() => setVisibleMonth((currentMonth) => subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="request-invite-expiration-step__calendar-nav-icon" />
                </button>

                <p className="request-invite-expiration-step__calendar-title">
                  {format(visibleMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                </p>

                <button
                  type="button"
                  className="request-invite-expiration-step__calendar-nav"
                  onClick={() => setVisibleMonth((currentMonth) => addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="request-invite-expiration-step__calendar-nav-icon" />
                </button>
              </div>

              <div className="request-invite-expiration-step__calendar-weekdays">
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label} className="request-invite-expiration-step__calendar-weekday">{label}</span>
                ))}
              </div>

              <div className="request-invite-expiration-step__calendar-grid">
                {calendarDays.map((day) => {
                  const isDisabled = isBefore(day, today);
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isOutsideMonth = !isSameMonth(day, visibleMonth);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      className={`request-invite-expiration-step__calendar-day${isSelected ? " request-invite-expiration-step__calendar-day--selected" : ""}${isOutsideMonth ? " request-invite-expiration-step__calendar-day--outside" : ""}${isToday(day) ? " request-invite-expiration-step__calendar-day--today" : ""}`}
                      onClick={() => {
                        if (isDisabled) {
                          return;
                        }

                        onChange(buildExpirationValue(day, timeFields.hour, timeFields.minute));
                        setIsOpen(false);
                      }}
                      disabled={isDisabled}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {errorMessage && (
          <p className="request-invite-expiration-step__error">{errorMessage}</p>
        )}
      </div>

      <div className="request-invite-expiration-step__field">
        <label className="request-invite-expiration-step__label" htmlFor="invite-expiration-hour">
          Horário de expiração <span className="request-invite-expiration-step__required">*</span>
        </label>

        <div className="request-invite-expiration-step__time-fields">
          <div className="request-invite-expiration-step__time-field">
            <label className="request-invite-expiration-step__time-label" htmlFor="invite-expiration-hour">
              Hora
            </label>
            <input
              id="invite-expiration-hour"
              inputMode="numeric"
              className="app-input request-invite-expiration-step__time-input"
              placeholder="23"
              value={timeFields.hour}
              onChange={(event) => handleTimeFieldChange("hour", event.target.value)}
              onBlur={() => handleTimeFieldBlur("hour")}
            />
          </div>

          <div className="request-invite-expiration-step__time-field">
            <label className="request-invite-expiration-step__time-label" htmlFor="invite-expiration-minute">
              Minuto
            </label>
            <input
              id="invite-expiration-minute"
              inputMode="numeric"
              className="app-input request-invite-expiration-step__time-input"
              placeholder="59"
              value={timeFields.minute}
              onChange={(event) => handleTimeFieldChange("minute", event.target.value)}
              onBlur={() => handleTimeFieldBlur("minute")}
            />
          </div>
        </div>
      </div>

      <div className="request-invite-expiration-step__summary">
        <p className="request-invite-expiration-step__summary-label">Data e horário escolhidos</p>
        <p className="request-invite-expiration-step__summary-value">
          {value ? formatValueForDisplay(value) : "Nenhuma validade definida até agora."}
        </p>
      </div>
    </div>
  );
};
