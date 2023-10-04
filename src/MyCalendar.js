import React, { useState, useEffect, useMemo } from 'react';
import { isAfter, startOfDay, isSameDay } from 'date-fns';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SchedulePopup from './SchedulePopup';
import './Calendar.css';
import { useParams } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [selectedTimeZone, setSelectedTimeZone] = useState(moment.tz.guess());
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenn, setIsPopupOpenn] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);


    const handleTimeZoneChange = (event) => {
        const newTimeZone = event.target.value;
        setSelectedTimeZone(newTimeZone);
        setSelectedDate(null);
        setTimeSlots([]);
    };

    const { username, event_link } = useParams();


    useEffect(() => {

        const apiUrl = `https://calendly.theworkflow.nyc/data/${username}/${event_link}`;

        // Make the API request
        axios.get(apiUrl)
            .then(response => {
                console.log(response.data);
                setScheduleData(response.data);
            })
            .catch(error => {
                console.error('Error fetching schedule data:', error);
            });
    }, [username, event_link]);


    const onSelectDate = (date) => {
        setSelectedDate(date);
        if (scheduleData && scheduleData.days) {
            const selectedDay = moment(date).format('dddd');
            console.log(selectedDay);
            const daySchedule = scheduleData.days.find(day => day.day === selectedDay);
            console.log(daySchedule);
            if (daySchedule && daySchedule.workday) {
                const startTime = moment(daySchedule.startTime, 'h:mmA');
                const endTime = moment(daySchedule.endTime, 'h:mmA');

                const eventDurationText = scheduleData.data.event_duration;
                const eventDurationMatch = eventDurationText.match(/\d+/);
                const eventDurationMinutes = eventDurationMatch ? parseInt(eventDurationMatch[0]) : 0;

                const eventDuration = moment.duration(eventDurationMinutes, 'minutes');

                const today = startOfDay(new Date());
                const currentTime = new Date();

                console.log(today, currentTime);

                if (isSameDay(new Date(date), today)) {
                    const timeSlots = [];
                    while (startTime.isBefore(endTime)) {
                        if (startTime.isAfter(currentTime)) {
                            timeSlots.push(startTime.clone());
                        }
                        startTime.add(eventDuration);
                    }
                    console.log(timeSlots);
                    setTimeSlots(timeSlots);
                    setIsPopupOpenn(true);
                } else if (isAfter(new Date(date), today)) {
                    const timeSlots = [];
                    while (startTime.isBefore(endTime)) {
                        timeSlots.push(startTime.clone());
                        startTime.add(eventDuration);
                    }
                    console.log(timeSlots);
                    setTimeSlots(timeSlots);
                    setIsPopupOpenn(true);
                } else {
                    setTimeSlots([]);
                    setIsPopupOpenn(false);
                }
            } else {
                setTimeSlots([]);
                setIsPopupOpenn(false);
            }
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

    const timeZones = useMemo(() => [
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
    ], []);


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

    const [timeZonesWithCurrentTime, setTimeZonesWithCurrentTime] = useState([]);

    useEffect(() => {
        const currentTimeZones = timeZones.map((tz) => {
            const currentDateTime = moment().tz(tz.value);
            return {
                ...tz,
                currentTime: currentDateTime.format('h:mmA'),
            };
        });
        setTimeZonesWithCurrentTime(currentTimeZones);
    }, [timeZones]);


    return (
        <>
            <div className="my-calendar-container">
                <div className="timezone-selector">
                    <label>Time Zone : </label>
                    &nbsp;
                    <select
                        className="form-select"
                        value={selectedTimeZone}
                        onChange={handleTimeZoneChange}
                        style={{ width: "100%" }}
                    >
                        {timeZonesWithCurrentTime.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label} - ({tz.currentTime})
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

                <div className="popup-modal" overlayclassname="popup-background-blur">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="time-slots">
                                {timeSlots.map((time) => (
                                    <div
                                        key={time.format()}
                                        onClick={() => openPopup(time)}
                                        className="time-slot"
                                    >
                                        {time.format('h:mmA')}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleClosePopup} className="btn btn-secondary close-button">x</button>

                        </div>
                    </div>
                </div>
            )}

            {isPopupOpen && selectedDate && scheduleData && (
                <SchedulePopup
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedTimeZone={selectedTimeZone}
                    data={scheduleData.data}
                />
            )}
        </>
    );
};



export default MyCalendar;
