(() => {
  const summary = document.querySelector('#weather-summary');
  if (!summary) return;
  const target = '2026-11-26';
  const conditions = {0:'Clear skies',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Freezing fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Freezing drizzle',57:'Freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Light showers',81:'Showers',82:'Heavy showers',85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorms',96:'Thunderstorms with hail',99:'Thunderstorms with hail'};
  async function load() {
    try {
      const today = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
      if (today > target) {
        summary.textContent = 'Thanksgiving 2026 has passed. Thanks for the memories!';
        return;
      }
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.15&longitude=-92.62&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago&forecast_days=16', {signal:AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error('Forecast unavailable');
      const {daily} = await response.json();
      const dates = [['2026-11-25', 'Wednesday · Nov 25'], [target, 'Thanksgiving · Nov 26'], ['2026-11-27', 'Friday · Nov 27']];
      const index = daily?.time?.indexOf(target) ?? -1;
      if (index < 0) {
        summary.textContent = 'The November 26 forecast isn’t available yet. Check back closer to Thanksgiving.';
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'weather-days';
      for (const [date, label] of dates) {
        const i = daily?.time?.indexOf(date) ?? -1;
        const day = document.createElement('div');
        day.className = date === target ? 'weather-day weather-day-main' : 'weather-day';
        const title = document.createElement('strong');
        title.textContent = label;
        const details = document.createElement('span');
        const high = daily.temperature_2m_max?.[i];
        const low = daily.temperature_2m_min?.[i];
        const rain = daily.precipitation_probability_max?.[i];
        if (i < 0 || !Number.isFinite(high) || !Number.isFinite(low)) {
          details.textContent = 'Forecast not available yet';
        } else {
          details.textContent = `${conditions[daily.weather_code?.[i]] || 'Forecast'} · High ${Math.round(high)}°F / Low ${Math.round(low)}°F${Number.isFinite(rain) ? ` · ${Math.round(rain)}% chance of precipitation` : ''}`;
        }
        day.append(title, details);
        if (date === target && i >= 0) {
          const speed = daily.wind_speed_10m_max?.[i];
          const gust = daily.wind_gusts_10m_max?.[i];
          const degrees = daily.wind_direction_10m_dominant?.[i];
          if (Number.isFinite(speed)) {
            const wind = document.createElement('span');
            wind.className = 'weather-wind';
            const direction = Number.isFinite(degrees) ? ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][((Math.round(degrees / 22.5) % 16) + 16) % 16] : '';
            wind.textContent = `Wind${direction ? ` ${direction}` : ''} · up to ${Math.round(speed)} mph${Number.isFinite(gust) ? ` · gusts ${Math.round(gust)} mph` : ''}`;
            day.append(wind);
          }
        }
        grid.append(day);
      }
      summary.replaceChildren(grid);
    } catch {
      summary.textContent = 'Weather is taking a break. Check back soon for the November 26 forecast.';
    }
  }
  load();
})();
