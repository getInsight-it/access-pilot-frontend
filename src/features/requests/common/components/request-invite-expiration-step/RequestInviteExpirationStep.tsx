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

const getDateFromValue = (value: string) => {
  if (!value) {
    return null;
  }

  return parseISO(`${value}T00:00:00`);
};

const formatValueForDisplay = (value: string) => {
  const date = getDateFromValue(value);

  if (!date) {
    return "Selecione uma data";
  }

  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const RequestInviteExpirationStep: React.FC<RequestInviteExpirationStepProps> = ({
  value,
  errorMessage,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = getDateFromValue(value);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(selectedDate || new Date()));
  const today = startOfDay(new Date());

  useEffect(() => {
    setVisibleMonth(startOfMonth(getDateFromValue(value) || new Date()));
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

  return (
    <div className="request-invite-expiration-step">
      <div className="request-invite-expiration-step__intro">
        <div className="request-invite-expiration-step__icon-box">
          <CalendarDays className="request-invite-expiration-step__icon" />
        </div>

        <div className="request-invite-expiration-step__intro-content">
          <h4 className="request-invite-expiration-step__title">Validade do convite</h4>
          <p className="request-invite-expiration-step__description">
            Escolha até quando o convite poderá ser utilizado pelos destinatários.
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

                        onChange(format(day, "yyyy-MM-dd"));
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

      <div className="request-invite-expiration-step__summary">
        <p className="request-invite-expiration-step__summary-label">Data escolhida</p>
        <p className="request-invite-expiration-step__summary-value">
          {value ? formatValueForDisplay(value) : "Nenhuma data definida até agora."}
        </p>
      </div>
    </div>
  );
};
