"use client";

// 풀페이지 3D 씬 (Phase 2: igloo식 스크롤 시네마틱 + Phase 3: bruno 오마주 이스터에그)
// - 캔버스는 fixed 배경(z:-1), 이벤트는 body에서 수신 → 콘텐츠 위에서도 커서가 씬에 닿는다
// - Act 1(히어로): 물리 카드 + 아바타 카드, 커서 밀치기/클릭 펀치
// - Act 2(여정): 카메라가 스크롤을 따라 하강 — 불씨 파티클과 와이어 구조물을 지나친다
// - Act 3(연락처): 중력 켜진 장난감 더미 — 굴리고 튕기는 미니 놀이터
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { Physics, RigidBody, BallCollider, CuboidCollider, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { metrics } from "../data";

const FONT_BOLD =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Bold.woff";
const FONT_MED =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Medium.woff";
const ACCENT = "#E63A0F";
const SCALE = 0.0058; // scrollY(px) → 카메라 하강량

type CardSpec = {
  home: [number, number, number];
  rot: number;
  value?: string;
  label?: string;
  w: number;
  h: number;
};

function buildCards(): CardSpec[] {
  const m = metrics;
  return [
    { home: [-4.6, 1.6, -1.2], rot: 0.16, value: m[0].value, label: m[0].label, w: 2.5, h: 1.5 },
    { home: [-4.2, -1.7, 0.2], rot: -0.1, value: m[1].value, label: m[1].label, w: 2.4, h: 1.45 },
    { home: [4.5, 1.8, -0.6], rot: -0.14, value: m[2].value, label: m[2].label, w: 2.6, h: 1.5 },
    { home: [4.4, -1.5, 0.4], rot: 0.12, value: m[4].value, label: m[4].label, w: 2.6, h: 1.5 },
    { home: [-2.0, 2.7, -2.4], rot: 0.06, label: "변제금 진단 리드 퍼널", w: 3.0, h: 0.8 },
    { home: [2.2, -2.9, -1.8], rot: -0.06, label: "발행 스튜디오 · SEO 대시보드", w: 3.4, h: 0.8 },
    { home: [0.3, 3.1, -2.8], rot: 0.04, label: "콘텐츠 운영 자동화 도구", w: 3.1, h: 0.8 },
  ];
}

function FloatCard({ spec, seed }: { spec: CardSpec; seed: number }) {
  const body = useRef<RapierRigidBody>(null);

  useFrame((state) => {
    const b = body.current;
    if (!b) return;
    const p = b.translation();
    const t = state.clock.elapsedTime + seed * 13.7;
    const hx = spec.home[0] + Math.sin(t * 0.5) * 0.18;
    const hy = spec.home[1] + Math.cos(t * 0.42) * 0.22;
    const hz = spec.home[2];
    b.applyImpulse({ x: (hx - p.x) * 0.014, y: (hy - p.y) * 0.014, z: (hz - p.z) * 0.014 }, true);
    const r = b.rotation();
    b.applyTorqueImpulse({ x: -r.x * 0.004, y: -r.y * 0.004, z: (spec.rot - r.z) * 0.004 }, true);
  });

  const punch = () => {
    const b = body.current;
    if (!b) return;
    b.applyImpulse({ x: (Math.random() - 0.5) * 2.2, y: (Math.random() - 0.3) * 1.6, z: 2.8 }, true);
    b.applyTorqueImpulse({ x: (Math.random() - 0.5) * 0.35, y: (Math.random() - 0.5) * 0.35, z: (Math.random() - 0.5) * 0.25 }, true);
  };

  // 스폰은 무대 밖 깊은 곳 — 물리 스프링이 홈으로 끌어와 "날아와 정렬"하는 입장 연출
  const spawn: [number, number, number] = [
    spec.home[0] * 1.5,
    spec.home[1] * 1.4 - 6.5,
    spec.home[2] - 15,
  ];

  return (
    <RigidBody
      ref={body}
      position={spawn}
      rotation={[0, 0, spec.rot]}
      linearDamping={2.4}
      angularDamping={2.6}
      gravityScale={0}
      colliders="cuboid"
    >
      <group onClick={punch}>
        <RoundedBox args={[spec.w, spec.h, 0.14]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color="#141416" roughness={0.38} metalness={0.35} />
        </RoundedBox>
        <RoundedBox args={[spec.w + 0.02, spec.h + 0.02, 0.1]} radius={0.03} smoothness={3}>
          <meshBasicMaterial color="#242428" wireframe transparent opacity={0.35} />
        </RoundedBox>
        {spec.value ? (
          <>
            <Text font={FONT_BOLD} fontSize={0.52} color="#ffffff" anchorX="left" anchorY="middle" position={[-spec.w / 2 + 0.22, 0.18, 0.09]}>
              {spec.value}
            </Text>
            <Text font={FONT_MED} fontSize={0.17} color="#9e9e9e" anchorX="left" anchorY="middle" position={[-spec.w / 2 + 0.23, -0.35, 0.09]}>
              {spec.label}
            </Text>
          </>
        ) : (
          <Text font={FONT_MED} fontSize={0.2} color="#b9b6be" anchorX="center" anchorY="middle" position={[0, 0, 0.09]}>
            {spec.label}
          </Text>
        )}
      </group>
    </RigidBody>
  );
}

// 커서를 따라다니며 밀치는 보이지 않는 구체 — 카메라 y를 따라와 전 구간에서 작동
function PointerBall() {
  const body = useRef<RapierRigidBody>(null);
  const { camera, pointer } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const b = body.current;
    if (!b) return;
    vec.set(pointer.x, pointer.y, 0.5).unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    b.setNextKinematicTranslation({
      x: camera.position.x + dir.x * dist,
      y: camera.position.y + dir.y * dist,
      z: 0,
    });
  });

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false}>
      <BallCollider args={[0.85]} />
    </RigidBody>
  );
}

// Act 2: 스크롤 여정의 불씨 파티클
function Embers({ depth }: { depth: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        x: (Math.random() - 0.5) * 17,
        y: -Math.random() * depth,
        z: -1.5 - Math.random() * 5,
        s: 0.03 + Math.random() * 0.07,
        sp: 0.15 + Math.random() * 0.5,
      })),
    [depth]
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((sd, i) => {
      dummy.position.set(sd.x + Math.sin(t * sd.sp + i) * 0.5, sd.y + Math.sin(t * sd.sp * 0.7 + i * 2) * 0.4, sd.z);
      dummy.scale.setScalar(sd.s * (1 + Math.sin(t * 2 + i) * 0.25));
      dummy.rotation.set(t * sd.sp, t * sd.sp * 0.6, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, seeds.length]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={ACCENT} transparent opacity={0.55} />
    </instancedMesh>
  );
}

// Act 2: 지나치는 와이어 구조물들
function Landmarks({ depth }: { depth: number }) {
  const specs = useMemo(() => {
    const arr: { y: number; x: number; kind: number; s: number }[] = [];
    const n = Math.max(2, Math.floor(depth / 11));
    for (let i = 0; i < n; i++) {
      arr.push({ y: -6 - i * (depth / n), x: i % 2 === 0 ? 5.4 : -5.4, kind: i % 3, s: 1.6 + (i % 3) * 0.5 });
    }
    return arr;
  }, [depth]);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((c, i) => {
      c.rotation.x = state.clock.elapsedTime * 0.12 * (i % 2 ? 1 : -1);
      c.rotation.y = state.clock.elapsedTime * 0.09;
    });
  });

  return (
    <group ref={group}>
      {specs.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, -3.5]} scale={s.s}>
          {s.kind === 0 ? <icosahedronGeometry args={[1, 0]} /> : s.kind === 1 ? <torusKnotGeometry args={[0.7, 0.2, 60, 8]} /> : <octahedronGeometry args={[1, 0]} />}
          <meshBasicMaterial color={i % 2 ? ACCENT : "#3a3a40"} wireframe transparent opacity={0.34} />
        </mesh>
      ))}
    </group>
  );
}

// Act 3: 연락처의 물리 놀이터 (bruno 오마주) — 중력을 받는 조각들
function Playground({ y }: { y: number }) {
  const toys = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        pos: [(Math.random() - 0.5) * 6, y - 0.5 + i * 0.75, (Math.random() - 0.5) * 1.4] as [number, number, number],
        accent: i % 3 === 0,
        s: 0.34 + Math.random() * 0.3,
      })),
    [y]
  );
  return (
    <group>
      {/* 보이지 않는 바닥/벽 — 카메라 시야 하단 1/3 지점에 조각들이 쌓인다 */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[9, 0.3, 4]} position={[0, y - 2.3, 0]} />
        <CuboidCollider args={[0.3, 5, 4]} position={[-8.6, y, 0]} />
        <CuboidCollider args={[0.3, 5, 4]} position={[8.6, y, 0]} />
      </RigidBody>
      {toys.map((t, i) => (
        <RigidBody key={i} position={t.pos} gravityScale={1} restitution={0.55} friction={0.8} colliders="cuboid">
          <mesh>
            <boxGeometry args={[t.s, t.s, t.s]} />
            <meshStandardMaterial color={t.accent ? ACCENT : "#1a1a1e"} roughness={0.4} metalness={0.3} emissive={t.accent ? ACCENT : "#000000"} emissiveIntensity={t.accent ? 0.25 : 0} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}

function Scene() {
  const cards = useMemo(buildCards, []);
  // state여야 측정 후 씬이 재배치된다 (ref는 재렌더를 안 일으킴)
  const [layout, setLayout] = useState({ depth: 30, playY: -28 });

  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement.scrollHeight - innerHeight;
      const contact = document.getElementById("contact");
      // 연락처 도달 시 카메라 y와 일치하는 지점 (스크롤 하한 클램프 감안)
      const playScroll = contact ? Math.min(contact.offsetTop - 84, doc) : doc;
      setLayout({ depth: doc * SCALE + 6, playY: -playScroll * SCALE });
    };
    measure();
    const t1 = setTimeout(measure, 1500); // 이미지 로드로 문서 높이가 늦게 확정되는 케이스
    const t2 = setTimeout(measure, 4000);
    addEventListener("resize", measure);
    addEventListener("load", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      removeEventListener("resize", measure);
      removeEventListener("load", measure);
    };
  }, []);

  const light = useRef<THREE.PointLight>(null);

  useFrame(({ camera, clock }) => {
    const sc = window.scrollY;
    camera.position.y = -sc * SCALE;
    camera.position.x = Math.sin(sc * 0.00045) * 1.1; // 여정의 좌우 위빙
    camera.position.z = 9 + Math.sin(sc * 0.0003) * 0.8;
    camera.rotation.z = Math.sin(sc * 0.0002 + clock.elapsedTime * 0.02) * 0.012;
    if (light.current) light.current.position.set(-7, camera.position.y - 4, 3);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={0.7} />
      <pointLight ref={light} position={[-7, -4, 3]} intensity={40} color={ACCENT} />
      <pointLight position={[7, 3, -2]} intensity={14} color="#ff8a5c" />
      <Embers depth={layout.depth} />
      <Landmarks depth={layout.depth} />
      <Physics gravity={[0, -6, 0]}>
        {/* 카드는 gravityScale 0이라 중력 무시, 장난감만 떨어진다 */}
        {cards.map((c, i) => (
          <FloatCard key={i} spec={c} seed={i} />
        ))}
        <Playground key={layout.playY} y={layout.playY} />
        <PointerBall />
      </Physics>
    </>
  );
}

// Suspense가 풀리는 순간(폰트·텍스처 준비 완료)을 부모에 알린다
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

export default function Hero3D({ onReady }: { onReady?: () => void }) {
  const [evtSrc, setEvtSrc] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setEvtSrc(document.body), []);
  if (!evtSrc) return null;

  // body로 포탈 — .hero의 perspective가 fixed의 기준이 되어 클리핑되는 것을 회피
  // 씬은 준비 완료 후 페이드인 — 갑작스러운 팝인 방지
  return createPortal(
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={evtSrc}
      eventPrefix="client"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: ready ? 1 : 0,
        transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Suspense fallback={null}>
        <Ready
          onReady={() => {
            setReady(true);
            onReady?.();
          }}
        />
        <Scene />
      </Suspense>
    </Canvas>,
    evtSrc
  );
}
