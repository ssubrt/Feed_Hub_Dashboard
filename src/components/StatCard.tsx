
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatCard: React.FC<Props> = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend = 'neutral',
  trendValue
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-semibold">{value}</p>
              {trendValue && (
                <span 
                  className={`ml-2 text-xs font-medium ${
                    trend === 'up' ? 'text-green-500' : 
                    trend === 'down' ? 'text-red-500' : 
                    'text-gray-500'
                  }`}
                >
                  {trendValue}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="p-2 rounded-full bg-creator-lightPurple bg-opacity-20">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
