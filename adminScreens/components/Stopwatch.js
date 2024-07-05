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
      }, 1000); // if isActive is on, it will change time every 1 second
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const setManualSeconds = (newSeconds) => {
    const secondsNumber = parseInt(newSeconds, 10);
    if (!isNaN(secondsNumber)) {
      setSeconds(secondsNumber);
    }
  };

  return { seconds, handleToggle, setManualSeconds };
}

export default Stopwatch;
