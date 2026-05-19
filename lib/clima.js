const LUNAR_CYCLE = 29.53058867;
const KNOWN_NEW_MOON = new Date("2000-01-06T12:00:00Z");

export function degreesToCompass(degrees) {
  if (degrees === null || degrees === undefined || Number.isNaN(Number(degrees))) {
    return "—";
  }

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(Number(degrees) / 45) % 8;
  return directions[index];
}

export function getWeatherCondition(code) {
  const value = Number(code);

  if (value === 0) return "Ensolarado";
  if (value <= 3) return "Parcialmente nublado";
  if (value <= 48) return "Neblina";
  if (value <= 57) return "Garoa";
  if (value <= 67) return "Chuva";
  if (value <= 77) return "Neve";
  if (value <= 82) return "Pancadas de chuva";
  if (value <= 86) return "Neve";
  if (value >= 95) return "Tempestade";

  return "Nublado";
}

export function getWeatherEmoji(code) {
  const value = Number(code);

  if (value === 0) return "☀️";
  if (value <= 3) return "⛅";
  if (value <= 48) return "🌫️";
  if (value <= 67) return "🌧️";
  if (value <= 77) return "❄️";
  if (value <= 82) return "🌦️";
  if (value >= 95) return "⛈️";

  return "☁️";
}

export function getUvLabel(uvIndex) {
  const uv = Number(uvIndex);
  if (!Number.isFinite(uv)) return { label: "—", level: "unknown" };

  if (uv <= 2) return { label: "Baixo", level: "low" };
  if (uv <= 5) return { label: "Moderado", level: "moderate" };
  if (uv <= 7) return { label: "Alto", level: "high" };
  if (uv <= 10) return { label: "Muito alto", level: "very-high" };
  return { label: "Extremo", level: "extreme" };
}

export function getUvProgress(uvIndex) {
  const uv = Number(uvIndex);
  if (!Number.isFinite(uv)) return 0;
  return Math.min(100, Math.round((uv / 11) * 100));
}

export function getBathStatus(waveHeight, windSpeedKmh) {
  const waves = Number(waveHeight);
  const wind = Number(windSpeedKmh);

  if (!Number.isFinite(waves) || !Number.isFinite(wind)) {
    return { label: "Moderado", tone: "moderate" };
  }

  if (waves > 2.5 || wind > 35) {
    return { label: "Agitado", tone: "rough" };
  }

  if (waves >= 1.5 || wind >= 20) {
    return { label: "Moderado", tone: "moderate" };
  }

  if (waves < 1.5 && wind < 20) {
    return { label: "Bom para banho", tone: "good" };
  }

  return { label: "Moderado", tone: "moderate" };
}

export function getWaveBarColor(height) {
  const value = Number(height);
  if (!Number.isFinite(value)) return "bg-gray-300";
  if (value < 1.5) return "bg-emerald-500";
  if (value <= 2.5) return "bg-amber-500";
  return "bg-red-500";
}

export function getMoonPhase(date = new Date()) {
  const diffDays =
    (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  const age = ((diffDays % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;

  if (age < LUNAR_CYCLE * 0.125) {
    return { name: "Nova", icon: "🌑" };
  }
  if (age < LUNAR_CYCLE * 0.375) {
    return { name: "Crescente", icon: "🌒" };
  }
  if (age < LUNAR_CYCLE * 0.625) {
    return { name: "Cheia", icon: "🌕" };
  }
  if (age < LUNAR_CYCLE * 0.875) {
    return { name: "Minguante", icon: "🌖" };
  }

  return { name: "Nova", icon: "🌑" };
}

function formatHourLabel(isoTime) {
  if (!isoTime) return "—";

  const date = new Date(isoTime);
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function formatNumber(value, digits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toFixed(digits);
}

export async function fetchClimaApis(latitude, longitude) {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,uv_index" +
    "&daily=temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo";

  const marineUrl =
    `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}` +
    "&current=wave_height,wave_period,wave_direction,sea_surface_temperature" +
    "&hourly=wave_height&timezone=America/Sao_Paulo&forecast_days=1";

  const [weatherRes, marineRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(marineUrl),
  ]);

  if (!weatherRes.ok || !marineRes.ok) {
    throw new Error("Falha ao buscar dados climáticos");
  }

  const weather = await weatherRes.json();
  const marine = await marineRes.json();

  return parseClimaData(weather, marine);
}

export function parseClimaData(weather, marine) {
  const current = weather?.current ?? {};
  const daily = weather?.daily ?? {};
  const marineCurrent = marine?.current ?? {};
  const hourlyTimes = marine?.hourly?.time ?? [];
  const hourlyWaves = marine?.hourly?.wave_height ?? [];

  const waveChart = [];
  for (let index = 0; index < 24 && waveChart.length < 8; index += 3) {
    waveChart.push({
      time: hourlyTimes[index],
      label: formatHourLabel(hourlyTimes[index]),
      height: hourlyWaves[index],
    });
  }

  const uv = getUvLabel(current.uv_index);
  const bathStatus = getBathStatus(
    marineCurrent.wave_height,
    current.windspeed_10m
  );

  return {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    weatherCode: current.weathercode,
    condition: getWeatherCondition(current.weathercode),
    weatherEmoji: getWeatherEmoji(current.weathercode),
    windSpeed: current.windspeed_10m,
    windDirection: current.winddirection_10m,
    windCompass: degreesToCompass(current.winddirection_10m),
    uvIndex: current.uv_index,
    uvLabel: uv.label,
    uvLevel: uv.level,
    tempMax: daily.temperature_2m_max?.[0],
    tempMin: daily.temperature_2m_min?.[0],
    waveHeight: marineCurrent.wave_height,
    wavePeriod: marineCurrent.wave_period,
    waveDirection: marineCurrent.wave_direction,
    waveCompass: degreesToCompass(marineCurrent.wave_direction),
    seaTemperature: marineCurrent.sea_surface_temperature,
    bathStatus,
    waveChart,
    moonPhase: getMoonPhase(),
  };
}

export function normalizePraias(rows) {
  return (rows ?? [])
    .map((row) => {
      const localizacao = Array.isArray(row.localizacoes)
        ? row.localizacoes[0]
        : row.localizacoes;
      const latitude = Number(localizacao?.latitude);
      const longitude = Number(localizacao?.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      return {
        id: row.id,
        nome: row.nome,
        latitude,
        longitude,
      };
    })
    .filter(Boolean);
}
