import React, { useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment-timezone';
import './SchedulePopup.css'; // Import your custom CSS for styling
Modal.setAppElement('#root'); // Set the app element to the root div


const SchedulePopup = ({ isOpen, onClose, selectedDate, selectedTime, selectedTimeZone }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: '',
        guests: '',
    });
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here (e.g., send data to the server)
        console.log('Form data:', formData);
        // Close the modal after submission
        onClose();
    };

    const formattedDate = selectedDate ? moment(selectedDate).format('dddd, MMMM D, YYYY') : '';
    // ...
    const formattedTime = selectedTime
        ? `${moment(selectedTime)
            .tz(selectedTimeZone) // Format selected time in the selected timezone
            .format('h:mmA')} - ${moment(selectedTime)
                .tz(selectedTimeZone)
                .add(30, 'minutes') // Add 30 minutes to the selected time
                .format('h:mmA')}` // Format the resulting time
        : '';
    // ...

    const formattedTimeZone = selectedTimeZone
        ? timeZones.find((tz) => tz.value === selectedTimeZone)?.label || ''
        : '';

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="popup-modal"
            overlayClassName="popup-background-blur" // Apply the background blur class here
        >
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <p className="modal-subtitle">{formattedTimeZone}</p>
                        <p className="modal-subtitle">30 Minute Meeting</p>
                        <p>{formattedTime}</p>
                        <p>{formattedDate}</p>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description:</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Add Guests (comma-separated emails):</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Schedule</button>
                            <button onClick={onClose} className="btn btn-secondary close-button">x</button>
                        </form>
                    </div>

                </div>
            </div>
        </Modal>
    );
};

export default SchedulePopup;
