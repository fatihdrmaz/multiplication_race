import { useEffect } from 'react';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

// 0-100 arası konumu sıçramadan, zamanla kayarak takip eden shared value
// linear: AI gibi düzenli aralıklarla güncellenen konumlarda kesintisiz hareket sağlar
export const useSmoothPosition = (position, { duration = 600, linear = false } = {}) => {
    const progress = useSharedValue(position);

    useEffect(() => {
        progress.value = withTiming(position, {
            duration,
            easing: linear ? Easing.linear : Easing.out(Easing.cubic),
        });
    }, [position]);

    return progress;
};
