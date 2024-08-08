import IconButton from '@mui/material/IconButton';
import WeatherNight from 'mdi-material-ui/WeatherNight';
import WeatherSunny from 'mdi-material-ui/WeatherSunny';
import React, { useEffect } from 'react';
import { getDarkModeStatus, setDarkModeStatus } from '../../../../service/AuthService';

const ModeToggler = props => {
  const { settings, saveSettings } = props;

  const fetchData = async () => {
    try {
      const modeval = await getDarkModeStatus();
      let modeTrue = modeval.data.darkMode === "true"; // String değeri boolean'a dönüştür
      let mode = modeTrue ? 'dark' : 'light'; // Boolean değere göre modu belirle
      handleModeChange(mode);
    } catch (error) {
      console.error('Error fetching dark mode status:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Boş dependency array ile sadece bir kere çağrılmasını sağlar

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode })
  }

  const handleModeToggle = () => {
    setDarkModeStatus();
    fetchData();
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      {settings.mode === 'dark' ? <WeatherSunny /> : <WeatherNight />}
    </IconButton>
  );
};

export default ModeToggler;
