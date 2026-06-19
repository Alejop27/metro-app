import { useState } from 'react';
import { transportService } from '../services/transportService';
import { routeService } from '../services/routeService';
import { ArrivalPrediction, CongestionPrediction, RouteRecommendation } from '../types';

export const useAIModel = () => {
  const [isPredictingArrival, setIsPredictingArrival] = useState(false);
  const [isPredictingCongestion, setIsPredictingCongestion] = useState(false);
  const [isRecommendingRoute, setIsRecommendingRoute] = useState(false);

  const [arrivalPrediction, setArrivalPrediction] = useState<ArrivalPrediction | null>(null);
  const [congestionPrediction, setCongestionPrediction] = useState<CongestionPrediction | null>(null);
  const [routeRecommendation, setRouteRecommendation] = useState<RouteRecommendation | null>(null);

  const predictArrival = async (busId: string, stationId: string, routeId: string) => {
    setIsPredictingArrival(true);
    try {
      const result = await transportService.predictArrival({ busId, stationId, routeId });
      setArrivalPrediction(result);
      return result;
    } catch (e) {
      console.error(e);
    } finally {
      setIsPredictingArrival(false);
    }
  };

  const predictCongestion = async (routeId: string) => {
    setIsPredictingCongestion(true);
    try {
      const result = await transportService.predictCongestion(routeId);
      setCongestionPrediction(result);
      return result;
    } catch (e) {
      console.error(e);
    } finally {
      setIsPredictingCongestion(false);
    }
  };

  const recommendRoute = async (originId: string, destinationId: string) => {
    setIsRecommendingRoute(true);
    try {
      const result = await routeService.recommendRoute(originId, destinationId);
      setRouteRecommendation(result);
      return result;
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecommendingRoute(false);
    }
  };

  const clearPredictions = () => {
    setArrivalPrediction(null);
    setCongestionPrediction(null);
    setRouteRecommendation(null);
  };

  return {
    isPredictingArrival,
    isPredictingCongestion,
    isRecommendingRoute,
    arrivalPrediction,
    congestionPrediction,
    routeRecommendation,
    predictArrival,
    predictCongestion,
    recommendRoute,
    clearPredictions
  };
};
export default useAIModel;
