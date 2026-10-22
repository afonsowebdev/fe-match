import { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';

import { colors, radii } from '@/theme';

const THUMB_SIZE = 30;

type SliderProps = {
  min: number;
  max: number;
  step?: number;
  // Um valor = slider simples; dois valores = intervalo (ex.: faixa etária).
  values: number[];
  onChange: (values: number[]) => void;
};

export function Slider({ min, max, step = 1, values, onChange }: SliderProps) {
  const [width, setWidth] = useState(0);
  const toX = (value: number) => ((value - min) / (max - min)) * width;

  const fillStart = values.length > 1 ? toX(values[0]) : 0;
  const fillEnd = toX(values[values.length - 1]);

  function move(index: number, x: number) {
    const raw = min + (x / width) * (max - min);
    // Num intervalo, os dois pontos ficam sempre pelo menos um passo afastados.
    const lowest = index > 0 ? values[index - 1] + step : min;
    const highest = index < values.length - 1 ? values[index + 1] - step : max;
    const value = Math.min(Math.max(Math.round(raw / step) * step, lowest), highest);
    if (value === values[index]) return;
    const next = [...values];
    next[index] = value;
    onChange(next);
  }

  return (
    <View style={styles.container} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={styles.track} />
      <View style={[styles.fill, { left: fillStart, width: fillEnd - fillStart }]} />
      {width > 0 &&
        values.map((value, index) => (
          <Thumb key={index} x={toX(value)} width={width} onMove={(x) => move(index, x)} />
        ))}
    </View>
  );
}

type ThumbProps = {
  x: number;
  width: number;
  onMove: (x: number) => void;
};

function Thumb({ x, width, onMove }: ThumbProps) {
  // Refs para os callbacks do gesto lerem sempre os valores mais recentes.
  const startX = useRef(0);
  const latest = useRef({ x, width, onMove });
  useLayoutEffect(() => {
    latest.current = { x, width, onMove };
  });

  const pan = usePanGesture({
    runOnJS: true,
    hitSlop: 12,
    onBegin: () => {
      startX.current = latest.current.x;
    },
    onUpdate: (e) => {
      const { width: trackWidth, onMove: move } = latest.current;
      move(Math.min(Math.max(startX.current + e.translationX, 0), trackWidth));
    },
  });

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.thumb, { left: x - THUMB_SIZE / 2 }]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    marginHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  fill: {
    position: 'absolute',
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
