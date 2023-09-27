import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SchedulePopup from './SchedulePopup';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [selectedTimeZone, setSelectedTimeZone] = useState('America/New_York');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenn, setIsPopupOpenn] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    // Inside the handleTimeZoneChange function, reset selectedDate and timeSlots
    const handleTimeZoneChange = (event) => {
        setSelectedTimeZone(event.target.value);
        setSelectedDate(null);
        setTimeSlots([]);
    };

    // Add an onSelectDate function to handle date selection
    const onSelectDate = (date) => {
        setSelectedDate(date);
        setIsPopupOpenn(true);

        const now = moment().tz(selectedTimeZone);
        const selectedDateTime = moment(date).tz(selectedTimeZone);

        // Show time slots only for future times
        if (selectedDateTime.isSameOrAfter(now, 'minute')) {
            const timeSlots = [];
            const startOfDay = moment(selectedDateTime).startOf('day');
            for (let i = 0; i < 24 * 2; i++) {
                const slotTime = moment(startOfDay).add(30 * i, 'minutes');
                if (slotTime.isSameOrAfter(now, 'minute')) {
                    timeSlots.push(slotTime);
                }
            }
            setTimeSlots(timeSlots);
        } else {
            setTimeSlots([]);
            setSelectedDate(null);
            setIsPopupOpenn(false);


        }
    };
    const events = [
        {
            title: 'Event 1',
            start: moment.tz('2023-09-27 10:00', selectedTimeZone).toDate(),
            end: moment.tz('2023-09-27 12:00', selectedTimeZone).toDate(),
        },
        // Add more events here
    ];

    const timeZones = [
        { value: 'Etc/GMT+12', label: 'GMT-12:00' },
        { value: 'Etc/GMT+11', label: 'GMT-11:00' },
        { value: 'Pacific/Honolulu', label: 'Hawaii-Aleutian Standard Time (HST)' },
        { value: 'America/Anchorage', label: 'Alaska Standard Time (AKST)' },
        { value: 'America/Los_Angeles', label: 'Pacific Standard Time (PST)' },
        { value: 'America/Phoenix', label: 'Mountain Standard Time (MST)' },
        { value: 'America/Denver', label: 'Mountain Standard Time (MST)' },
        { value: 'America/Chicago', label: 'Central Standard Time (CST)' },
        { value: 'America/New_York', label: 'Eastern Standard Time (EST)' },
        { value: 'America/Argentina/Buenos_Aires', label: 'Argentina Standard Time (ART)' },
        { value: 'America/Sao_Paulo', label: 'Brasília Standard Time (BRT)' },
        { value: 'America/St_Johns', label: 'Newfoundland Standard Time (NST)' },
        { value: 'America/Halifax', label: 'Atlantic Standard Time (AST)' },
        { value: 'Atlantic/Cape_Verde', label: 'Cape Verde Standard Time (CVT)' },
        { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
        { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
        { value: 'Europe/Paris', label: 'Central European Time (CET)' },
        { value: 'Europe/Athens', label: 'Eastern European Time (EET)' },
        { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
        { value: 'Asia/Kolkata', label: 'Indian Standard Time (IST)' },
        { value: 'Asia/Bangkok', label: 'Indochina Time (ICT)' },
        { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
        { value: 'Australia/Sydney', label: 'Australian Eastern Standard Time (AEST)' },
        { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST)' },
        // Add more time zones as needed
    ];


    const openPopup = (time) => {
        setSelectedTime(time);
        setIsPopupOpen(true);
        setIsPopupOpenn(false);

    };

    const handleClosePopup = () => {
        setSelectedDate(null);
        setSelectedTime(null);
        setIsPopupOpen(false);
        setTimeSlots([]);
        setIsPopupOpenn(false);

    };
    return (
        <>

            <div className="my-calendar-container">
                <div className="timezone-selector">
                    <label>Select Time Zone : </label>
                    <select
                        className="form-select"
                        value={selectedTimeZone}
                        onChange={handleTimeZoneChange}
                    >
                        {timeZones.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    selectable={true}
                    onSelectSlot={(slotInfo) => onSelectDate(slotInfo.start)}
                    views={['month']}
                    defaultView="month"
                />

            </div>

            {isPopupOpenn && (

                <div className="popup-modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="time-slots">
                                {timeSlots.map((time) => (
                                    <div
                                        key={time.format()}
                                        onClick={() => openPopup(time)}
                                        className="time-slot"
                                    >
                                        {time.format('HH:mm A')}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleClosePopup} className="btn btn-secondary close-button">x</button>

                        </div>
                    </div>
                </div>
            )}

            {isPopupOpen && selectedDate && (
                <SchedulePopup
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedTimeZone={selectedTimeZone}
                />
            )}
        </>
    );
};



export default MyCalendar;
