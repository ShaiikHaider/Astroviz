import { motion } from 'framer-motion';
import { Activity, Zap, Target, Clock, Gauge, Mountain } from 'lucide-react';

const LiveDataPanel = ({ data }) => {
  const {
    distanceFromEarth,
    currentVelocity,
    timeToImpact,
    impactEnergy,
    craterSize,
    seismicMagnitude,
    position
  } = data;

  const dataItems = [
    {
      icon: Target,
      label: 'Distance from Earth',
      value: `${distanceFromEarth.toFixed(0)} km`,
      color: 'text-primary'
    },
    {
      icon: Gauge,
      label: 'Current Velocity',
      value: `${currentVelocity.toFixed(2)} km/s`,
      color: 'text-secondary'
    },
    {
      icon: Clock,
      label: 'Time to Close Approach',
      value: `${timeToImpact.toFixed(1)} days`,
      color: 'text-accent'
    },
    {
      icon: Zap,
      label: 'Impact Energy',
      value: `${impactEnergy.toFixed(2)} MT`,
      color: 'text-yellow-500'
    },
    {
      icon: Mountain,
      label: 'Crater Size',
      value: `${craterSize.toFixed(2)} km`,
      color: 'text-orange-500'
    },
    {
      icon: Activity,
      label: 'Seismic Magnitude',
      value: seismicMagnitude.toFixed(2),
      color: 'text-red-500'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-lg font-bold">Live Simulation Data</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {dataItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-background/50 rounded-lg p-3 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
            <p className={`text-lg font-bold font-mono ${item.color}`}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-background/30 rounded-lg border border-border/50">
        <p className="text-xs text-muted-foreground mb-1">Position (x, y, z)</p>
        <p className="text-sm font-mono text-primary">
          ({position.x.toFixed(2)}, {position.y.toFixed(2)}, {position.z.toFixed(2)}) km
        </p>
      </div>
    </motion.div>
  );
};

export default LiveDataPanel;
