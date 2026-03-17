import { useState, useEffect, useCallback, useRef } from "react";
import { createEventEmitter, subscribeToContractEvents, formatEventForFeed } from "../lib/events";
import { CONTRACT_ID } from "../lib/constants";

export function useEvents() {
  const emitterRef = useRef(null);
  const [events, setEvents] = useState([
    formatEventForFeed("deploy", {}),
    formatEventForFeed("init", { optionCount: 4 }),
  ]);

  useEffect(() => {
    const emitter = createEventEmitter();
    emitterRef.current = emitter;

    const unsubscribe = subscribeToContractEvents(CONTRACT_ID, emitter);

    const off = emitter.on("vote", (data) => {
      setEvents((prev) => [formatEventForFeed("vote", data), ...prev.slice(0, 24)]);
    });

    return () => { unsubscribe(); off(); };
  }, []);

  const addEvent = useCallback((type, data) => {
    setEvents((prev) => [formatEventForFeed(type, data), ...prev.slice(0, 24)]);
  }, []);

  return { events, addEvent, emitter: emitterRef.current };
}