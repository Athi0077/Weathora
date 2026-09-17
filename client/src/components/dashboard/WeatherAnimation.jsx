import React, { useMemo } from 'react';
import styles from './WeatherAnimation.module.css';

const WeatherAnimation = ({ weather }) => {
  // If no weather or unknown, use default subtle clouds
  const condition = weather?.condition || 'Unknown';
  
  const generateRandomParams = (index, maxDuration, minDuration) => {
    // Generate deterministic pseudo-random values based on index to avoid hydration mismatch if SSR 
    const seed = index * 137;
    const duration = minDuration + (seed % (maxDuration - minDuration));
    const delay = (seed % 100) / 10;
    const top = 10 + (seed % 70); // 10% to 80%
    const scale = 0.5 + ((seed % 50) / 100);
    const opacity = 0.4 + ((seed % 40) / 100);
    
    return { duration, delay, top, scale, opacity };
  };

  const elements = useMemo(() => {
    const els = [];
    
    const addCloud = (id, direction, isDark = false, count = 1) => {
      for (let i = 0; i < count; i++) {
        const p = generateRandomParams(id + i, 40, 20);
        els.push(
          <div 
            key={`cloud-${id}-${i}`}
            className={`${styles.cloud} ${isDark ? styles.cloudDark : styles.cloudLight} ${direction === 'LR' ? styles.moveLR : styles.moveRL}`}
            style={{
              top: `${p.top}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              transform: `scale(${p.scale})`,
              opacity: p.opacity,
              zIndex: Math.floor(p.scale * 10)
            }}
          >
            ☁️
          </div>
        );
      }
    };

    const addSun = (id) => {
      els.push(
        <div 
          key={`sun-${id}`}
          className={styles.sun}
          style={{
            top: '20%',
            left: '70%',
            opacity: 0.9,
          }}
        >
          ☀️
        </div>
      );
    };

    const addRain = (id, count = 20) => {
      for (let i = 0; i < count; i++) {
        const p = generateRandomParams(id + i, 2, 1);
        const left = (i * 137) % 100;
        els.push(
          <div 
            key={`rain-${id}-${i}`}
            className={`${styles.rainDrop} ${styles.fallRain}`}
            style={{
              top: '-20px',
              left: `${left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              opacity: p.opacity
            }}
          />
        );
      }
    };

    const addSnow = (id, count = 20) => {
      for (let i = 0; i < count; i++) {
        const p = generateRandomParams(id + i, 5, 3);
        const left = (i * 137) % 100;
        els.push(
          <div 
            key={`snow-${id}-${i}`}
            className={`${styles.snowFlake} ${styles.fallSnow}`}
            style={{
              top: '-20px',
              left: `${left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              opacity: p.opacity,
              fontSize: `${0.5 + p.scale}rem`
            }}
          >
            ❄️
          </div>
        );
      }
    };

    // Mappings
    if (condition === 'Clear' || condition === 'Sunny') {
      addSun(1);
      addCloud(100, 'LR', false, 1);
      addCloud(200, 'RL', false, 1);
    } else if (condition === 'Clouds' || condition === 'Partly Cloudy') {
      addCloud(100, 'LR', false, 3);
      addCloud(200, 'RL', false, 2);
    } else if (condition === 'Rain') {
      addCloud(100, 'LR', true, 3);
      addCloud(200, 'RL', true, 2);
      addRain(300, 30);
    } else if (condition === 'Drizzle') {
      addCloud(100, 'LR', false, 2);
      addRain(300, 15);
    } else if (condition === 'Thunderstorm') {
      addCloud(100, 'LR', true, 4);
      addCloud(200, 'RL', true, 3);
      addRain(300, 40);
      els.push(<div key="lightning" className={styles.lightning} />);
    } else if (condition === 'Snow') {
      addCloud(100, 'LR', false, 3);
      addCloud(200, 'RL', false, 2);
      addSnow(300, 30);
    } else if (condition === 'Fog' || condition === 'Mist') {
      addCloud(100, 'LR', false, 2);
      els.push(<div key="fog-1" className={styles.fog} style={{ top: '10%' }} />);
      els.push(<div key="fog-2" className={styles.fog} style={{ top: '50%', animationDelay: '-7s' }} />);
    } else {
      // Unknown / Neutral
      addCloud(100, 'LR', false, 2);
      addCloud(200, 'RL', false, 1);
    }
    
    return els;
  }, [condition]);

  return (
    <div className={styles.weatherBanner} data-condition={condition} aria-hidden="true">
      {elements}
    </div>
  );
};

export default WeatherAnimation;

