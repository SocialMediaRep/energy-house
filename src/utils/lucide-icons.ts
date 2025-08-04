import { Wind, Droplets, Fan, Smartphone, Monitor, Tv, Speaker, Gamepad2, Router, Microwave, Refrigerator, ChefHat, Waves, Bike, Car, NotebookIcon as Scooter, WashingMachine, GalleryThumbnails as TumbleDryer, Flame, Snowflake, Power, Thermometer, Timer, Sun, Plug, CheckCircle, X, Lightbulb, Zap, Settings, ThermometerSun, Info } from 'lucide-react';
import { Bot } from 'lucide-react';

export const iconMap = {
  // Device icons
  Wind,
  Droplets,
  Fan,
  Smartphone,
  Monitor,
  Tv,
  Speaker,
  Gamepad2,
  Router,
  Microwave,
  Refrigerator,
  ChefHat,
  Waves,
  Bike,
  Car,
  Scooter,
  WashingMachine,
  TumbleDryer,
  Flame,
  Snowflake,
  Bot,
  // Challenge icons
  Power,
  Thermometer,
  Timer,
  Sun,
  Plug,
  // UI icons
  CheckCircle,
  X,
  Lightbulb,
  Zap,
  Settings,
  ThermometerSun,
  Info
};

export type IconName = keyof typeof iconMap;