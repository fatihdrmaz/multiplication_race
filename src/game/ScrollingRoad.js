import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, CURB_TILE, CURB_TILE_SIZE, CURB_WIDTH, DECOR } from './laneAssets';

const CURB_VISUAL = 16; // Ekranda bordürün genişliği (px)
const DASH = 34;
const DASH_PERIOD = 72;
const DECOR_SPACING = 120;
const DECOR_MARGIN = 140; // Ekran dışı tampon: süsler üstten belirip alttan kaybolur

// Dünya ilerledikçe (distance) aşağı kayan ve sonsuz tekrarlanan katman
const ScrollLoop = ({ distance, period, style, children }) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: (distance.value % period) - period }],
    }), [period]);
    return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

const Curb = ({ distance, height, side }) => {
    const scale = CURB_VISUAL / CURB_WIDTH;
    const tile = CURB_TILE_SIZE * scale;
    const rows = Math.ceil(height / tile) + 2;

    return (
        <View style={[styles.curb, { width: CURB_VISUAL, height }]}>
            <ScrollLoop distance={distance} period={tile} style={styles.fill}>
                {Array.from({ length: rows }, (_, i) => (
                    <Image
                        key={i}
                        source={CURB_TILE}
                        style={{
                            position: 'absolute',
                            top: i * tile,
                            // Sağ bordür için karonun sağ kenarını göster
                            left: side === 'left' ? 0 : CURB_VISUAL - tile,
                            width: tile,
                            height: tile,
                        }}
                    />
                ))}
            </ScrollLoop>
        </View>
    );
};

const LaneDivider = ({ distance, height, x }) => {
    const dashes = Math.ceil(height / DASH_PERIOD) + 2;
    return (
        <ScrollLoop distance={distance} period={DASH_PERIOD} style={[styles.divider, { left: x - 2, height: height + DASH_PERIOD }]}>
            {Array.from({ length: dashes }, (_, i) => (
                <View key={i} style={[styles.dash, { top: i * DASH_PERIOD }]} />
            ))}
        </ScrollLoop>
    );
};

const DecorItem = ({ distance, item, loop }) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: ((distance.value + item.offset) % loop) - DECOR_MARGIN }],
    }), [loop]);

    return (
        <Animated.Image
            source={item.src}
            style={[{ position: 'absolute', top: 0, left: item.x, width: item.w, height: item.h }, animatedStyle]}
        />
    );
};

// Yol kenarı süslerini (ağaç, lastik, koni...) iki yandaki çimlere yerleştirir
const buildDecor = (width, height, roadLeft, roadWidth) => {
    const side = roadLeft;
    if (side < 28) return { items: [], loop: 1 };

    const pool = side > 110
        ? [DECOR.treeLarge, DECOR.treeSmall, DECOR.tiresRed, DECOR.tribune, DECOR.treeSmall, DECOR.cone]
        : [DECOR.treeSmall, DECOR.tiresRed, DECOR.treeLarge, DECOR.cone, DECOR.tiresWhite, DECOR.barrel, DECOR.rock];

    const loop = height + DECOR_MARGIN * 2;
    const count = Math.ceil(loop / DECOR_SPACING);
    const items = [];

    for (let i = 0; i < count * 2; i++) {
        const isLeft = i % 2 === 0;
        const d = pool[(i * 3 + (isLeft ? 0 : 2)) % pool.length];
        const maxW = side - 8;
        const scale = Math.min(maxW / d.w, (d === DECOR.tribune ? 0.35 : 0.5));
        const w = d.w * scale;
        const h = d.h * scale;
        const jitter = ((i * 37) % 23) - 11;
        const x = isLeft
            ? Math.max(2, (side - w) / 2 + jitter * 0.3)
            : roadLeft + roadWidth + Math.max(2, (side - w) / 2 - jitter * 0.3);
        items.push({ key: i, src: d.src, w, h, x, offset: Math.floor(i / 2) * DECOR_SPACING + (isLeft ? 0 : DECOR_SPACING / 2) + jitter });
    }
    return { items, loop };
};

const ScrollingRoad = ({ distance, width, height, roadLeft, roadWidth, lanes }) => {
    const { items, loop } = useMemo(
        () => buildDecor(width, height, roadLeft, roadWidth),
        [width, height, roadLeft, roadWidth]
    );
    const laneWidth = roadWidth / lanes;

    return (
        <View style={[styles.fill, { backgroundColor: COLORS.grass }]} pointerEvents="none">
            {items.map((item) => <DecorItem key={item.key} distance={distance} item={item} loop={loop} />)}

            <View style={[styles.road, { left: roadLeft, width: roadWidth, height }]}>
                {Array.from({ length: lanes - 1 }, (_, i) => (
                    <LaneDivider key={i} distance={distance} height={height} x={laneWidth * (i + 1)} />
                ))}
            </View>

            <View style={{ position: 'absolute', left: roadLeft - CURB_VISUAL, top: 0 }}>
                <Curb distance={distance} height={height} side="left" />
            </View>
            <View style={{ position: 'absolute', left: roadLeft + roadWidth, top: 0 }}>
                <Curb distance={distance} height={height} side="right" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
    },
    road: {
        position: 'absolute',
        top: 0,
        backgroundColor: COLORS.asphalt,
        overflow: 'hidden',
    },
    curb: {
        overflow: 'hidden',
    },
    divider: {
        position: 'absolute',
        top: 0,
        width: 4,
    },
    dash: {
        position: 'absolute',
        left: 0,
        width: 4,
        height: DASH,
        borderRadius: 2,
        backgroundColor: COLORS.laneLine,
    },
});

export default ScrollingRoad;
