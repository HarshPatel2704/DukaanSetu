import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

const StatItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

const TrailCard = React.forwardRef(
  (
    {
      className,
      imageUrl,
      mapImageUrl,
      title,
      location,
      difficulty,
      creators,
      distance,
      elevation,
      duration,
      onDirectionsClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-[280px] overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg border border-border",
          className
        )}
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-3">
            <div className="text-white overflow-hidden">
              <h3 className="text-lg font-bold truncate">{title}</h3>
              <p className="text-xs text-white/90 truncate">{location}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-bold text-primary">{difficulty}</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0.8, scale: 0.9 }}
            >
               <Button
                variant="outline"
                size="sm"
                onClick={onDirectionsClick}
                className="h-8 px-2 text-xs"
              >
                Add to Cart
              </Button>
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-3">{creators}</p>
          
          <div className="pt-3 border-t border-border flex justify-between items-center">
            <StatItem label="Price" value={distance} />
            <StatItem label="Elevation" value={elevation} />
            <StatItem label="Duration" value={duration} />
          </div>
        </div>
      </motion.div>
    );
  }
);

TrailCard.displayName = "TrailCard";

export { TrailCard };
