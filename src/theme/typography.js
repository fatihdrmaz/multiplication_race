import { Text, TextInput, StyleSheet } from 'react-native';
import {
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';

// Baloo 2: yuvarlak, çocuk dostu ve Türkçe karakterleri (ş, ğ, ı, İ) tam destekler
export const FONT_ASSETS = {
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
};

export const FONTS = {
    medium: 'Baloo2_500Medium',
    semibold: 'Baloo2_600SemiBold',
    bold: 'Baloo2_700Bold',
    extrabold: 'Baloo2_800ExtraBold',
};

// Mevcut fontWeight değerlerini Baloo 2 ailesindeki karşılığına çevirir
const FAMILY_BY_WEIGHT = {
    normal: FONTS.medium,
    '100': FONTS.medium,
    '200': FONTS.medium,
    '300': FONTS.medium,
    '400': FONTS.medium,
    '500': FONTS.medium,
    '600': FONTS.semibold,
    '700': FONTS.bold,
    bold: FONTS.bold,
    '800': FONTS.extrabold,
    '900': FONTS.extrabold,
};

let applied = false;

// Tüm Text/TextInput bileşenlerine Baloo 2 uygular; stilde fontFamily verilmişse ona dokunmaz
export const applyGlobalFont = () => {
    if (applied) return;
    applied = true;

    [Text, TextInput].forEach((Component) => {
        const originalRender = Component.render;
        if (!originalRender) return;

        Component.render = function (props, ref) {
            const flat = StyleSheet.flatten(props.style) || {};
            if (flat.fontFamily) return originalRender.call(this, props, ref);

            const fontFamily = FAMILY_BY_WEIGHT[String(flat.fontWeight ?? 'normal')] || FONTS.medium;
            // Ağırlık font dosyasından gelir; 'normal' sahte kalınlaştırmayı önler
            const style = [props.style, { fontFamily, fontWeight: 'normal' }];
            return originalRender.call(this, { ...props, style }, ref);
        };
    });
};
