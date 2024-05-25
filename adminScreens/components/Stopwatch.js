import { useState, useEffect } from "react";

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          return newSeconds;
        });
      }, 1000); // if isActive is on, it will change time every 1000 milliseconds
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return { seconds, handleToggle };
}

export default Stopwatch;
