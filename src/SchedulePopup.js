import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';

import moment from 'moment-timezone';
import './SchedulePopup.css'; // Import your custom CSS for styling
Modal.setAppElement('#root'); // Set the app element to the root div


const SchedulePopup = ({ isOpen, onClose, selectedDate, selectedTime, selectedTimeZone, data }) => {
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

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // ...

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!formData.name || !formData.email) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Name and Email are required fields.',
                timer: 3000,
                showConfirmButton: false,
            });
            setIsLoading(false);

            return; // Exit the function without submitting if fields are empty
        }

        // Prepare the JSON data to send
        const postData = {
            guest_name: formData.name,
            guest_email: formData.email,
            guest_notes: formData.description,
            guest_date: moment(selectedDate).tz(selectedTimeZone).format('DD/MM/YYYY'),
            guest_time: moment(selectedTime).tz(selectedTimeZone).format('HH:mm'),
        };

        // Define the API URL
        const apiUrl = 'https://calendly.theworkflow.nyc/test06/hello';

        // Send the POST request
        axios.post(apiUrl, postData)
            .then((response) => {
                // Handle the response here if needed
                console.log('Response:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Event added successfully.',
                    timer: 3000, // Auto-close after 3 seconds
                    showConfirmButton: false, // Hide the "OK" button
                });
                onClose();

            })
            .catch((error) => {
                // Handle errors here
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error,
                    timer: 3000, // Auto-close after 3 seconds
                    showConfirmButton: false, // Hide the "OK" button
                });
            })
            .finally(() => {
                // Set loading back to false after the request is complete
                setIsLoading(false);
            });


        // Close the modal after submission
    };


    const formattedDate = selectedDate ? moment(selectedDate).tz(selectedTimeZone).format('dddd, MMMM D, YYYY') : '';



    const eventDurationText = data.event_duration;
    const eventDurationMatch = eventDurationText.match(/\d+/); // Extracts numerical value
    const eventDurationMinutes = eventDurationMatch ? parseInt(eventDurationMatch[0]) : 0;
    console.log(selectedTime);
    const formattedTime = selectedTime
        ? `${moment(selectedTime).tz(selectedTimeZone).format('h:mmA')} - ${moment(selectedTime)
            .tz(selectedTimeZone)
            .add(eventDurationMinutes, 'minutes')
            .format('h:mmA')}`
        : '';

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
                        <p className="modal-subtitle">{data.event_name}</p>
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
                            <button type="submit" className="btn btn-primary">
                                {isLoading ? 'Submitting...' : 'Schedule'}
                            </button>
                            <button onClick={onClose} className="btn btn-secondary close-button">x</button>
                        </form>
                    </div>

                </div>
            </div>
        </Modal>
    );
};

export default SchedulePopup;
