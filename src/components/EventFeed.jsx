import React, { useRef, useEffect } from "react";
import "./EventFeed.css";

export default function EventFeed({ events }) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [events.length]);

  return (
    <div className="event-feed">
      <div className="event-feed-header">
        <span className="event-feed-dot" />
        <span>Live Activity</span>
      </div>
      <div className="event-feed-list" ref={feedRef}>
        {events.length === 0 ? (
          <div className="event-empty">Waiting for activity...</div>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className={`event-item ${idx === 0 ? "event-new" : ""}`}>
              <span className="event-type-icon">{event.icon}</span>
              <div className="event-details">
                <span className="event-text">{event.text}</span>
                <span className="event-time">{event.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}