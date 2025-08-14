import { Wind, Droplets, Fan, Smartphone, Monitor, Tv, Speaker, Gamepad2, Router, Microwave, Refrigerator, ChefHat, Waves, Bike, Car, NotebookIcon as Scooter, WashingMachine, GalleryThumbnails as TumbleDryer, Flame, Snowflake, Power, Sun, X, Lightbulb, Zap, Info } from 'lucide-react';
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
  Power,
  Sun,
  // UI icons
  X,
  Lightbulb,
  Zap,
  Info
};

export type IconName = keyof typeof iconMap;