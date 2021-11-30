import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Observable } from 'rxjs';


import { Controls } from './components/Controls';

const App = () => {
  const [state, setState] = useState('stop');
  const [time, setTime] = useState(0);
  const [isWait, setWait] = useState(false)

  const start = () => {
    setState('start');
  };

  const stop = useCallback(() => {
    setTime(0);
    setState('stop');
  }, []);

  const reset = useCallback(() => {
    setTime(0);
  }, []);

  const wait = useCallback(() => {
    if (isWait) {
      setState('wait');
    }
    else {
      setTimeout(() => setWait(false), 300)
      setWait(true)
    }
  }, [isWait]);

  useEffect(() => {
    const timer$ = new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count += 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    });

    const subscribtion$ = timer$
      .subscribe({
        next: () => {
          if (state === 'start') {
            setTime((prev) => prev + 1);
          }
        },
      });

    return (() => {
      subscribtion$.unsubscribe();
    });
  }, [state]);

  return (
    <section className="stopwatch">
      <Controls
        time={time}
        start={start}
        stop={stop}
        reset={reset}
        wait={wait}
      />
    </section>
  );
};

export default App;
