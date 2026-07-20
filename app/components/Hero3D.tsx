"use client";

// 진짜 3D 히어로 씬 (Lusion 하이브리드 문법) —
// 지표 카드가 물리 오브젝트로 부유하고, 커서가 밀치고, 클릭하면 튕긴다.
// 데스크톱 전용: 모바일/저사양/reduced-motion은 HeroV2의 CSS 클라우드로 폴백.
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { Physics, RigidBody, BallCollider, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { metrics } from "../data";

const FONT_BOLD =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Bold.woff";
const FONT_MED =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Medium.woff";

const ACCENT = "#E63A0F";

type CardSpec = {
  home: [number, number, number];
  rot: number;
  value?: string;
  label: string;
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
    { home: [-1.9, 2.6, -2.2], rot: 0.06, label: "변제금 진단 리드 퍼널", w: 3.0, h: 0.8 },
    { home: [2.2, -2.8, -1.6], rot: -0.06, label: "발행 스튜디오 · SEO 대시보드", w: 3.4, h: 0.8 },
    { home: [0.2, -3.1, -2.6], rot: 0.04, label: "콘텐츠 운영 자동화 도구", w: 3.1, h: 0.8 },
  ];
}

function FloatCard({ spec, seed }: { spec: CardSpec; seed: number }) {
  const body = useRef<RapierRigidBody>(null);

  useFrame((state) => {
    const b = body.current;
    if (!b) return;
    const p = b.translation();
    // 홈 포지션으로 되돌아오는 스프링 + 미세한 유영
    const t = state.clock.elapsedTime + seed * 13.7;
    const hx = spec.home[0] + Math.sin(t * 0.5) * 0.18;
    const hy = spec.home[1] + Math.cos(t * 0.42) * 0.22;
    const hz = spec.home[2];
    const k = 0.9;
    b.applyImpulse({ x: (hx - p.x) * k * 0.016, y: (hy - p.y) * k * 0.016, z: (hz - p.z) * k * 0.016 }, true);
    // 회전 복원
    const r = b.rotation();
    b.applyTorqueImpulse({ x: -r.x * 0.004, y: -r.y * 0.004, z: (spec.rot - r.z) * 0.004 }, true);
  });

  const punch = () => {
    const b = body.current;
    if (!b) return;
    b.applyImpulse({ x: (Math.random() - 0.5) * 2.2, y: (Math.random() - 0.3) * 1.6, z: 2.8 }, true);
    b.applyTorqueImpulse({ x: (Math.random() - 0.5) * 0.35, y: (Math.random() - 0.5) * 0.35, z: (Math.random() - 0.5) * 0.25 }, true);
  };

  return (
    <RigidBody
      ref={body}
      position={spec.home}
      rotation={[0, 0, spec.rot]}
      linearDamping={2.4}
      angularDamping={2.6}
      gravityScale={0}
      colliders="cuboid"
    >
      <group onClick={punch} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
        <RoundedBox args={[spec.w, spec.h, 0.14]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color="#141416" roughness={0.38} metalness={0.35} />
        </RoundedBox>
        {/* 테두리 라인 느낌의 미세 발광 엣지 */}
        <RoundedBox args={[spec.w + 0.02, spec.h + 0.02, 0.1]} radius={0.03} smoothness={3}>
          <meshBasicMaterial color="#242428" wireframe transparent opacity={0.35} />
        </RoundedBox>
        {spec.value ? (
          <>
            <Text
              font={FONT_BOLD}
              fontSize={0.52}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
              position={[-spec.w / 2 + 0.22, 0.18, 0.09]}
            >
              {spec.value}
            </Text>
            <Text
              font={FONT_MED}
              fontSize={0.17}
              color="#9e9e9e"
              anchorX="left"
              anchorY="middle"
              position={[-spec.w / 2 + 0.23, -0.35, 0.09]}
            >
              {spec.label}
            </Text>
          </>
        ) : (
          <Text
            font={FONT_MED}
            fontSize={0.2}
            color="#b9b6be"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.09]}
          >
            {spec.label}
          </Text>
        )}
      </group>
    </RigidBody>
  );
}

// 커서를 따라다니며 카드를 밀치는 보이지 않는 구체
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
    const x = camera.position.x + dir.x * dist;
    const y = camera.position.y + dir.y * dist;
    b.setNextKinematicTranslation({ x, y, z: 0 });
  });

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false}>
      <BallCollider args={[0.85]} />
    </RigidBody>
  );
}

function Scene() {
  const cards = useMemo(buildCards, []);
  const group = useRef<THREE.Group>(null);

  // 스크롤에 반응하는 카메라/씬 — 히어로를 벗어나며 장면이 뒤로 눕는다
  useFrame(({ camera }) => {
    const sc = typeof window !== "undefined" ? window.scrollY : 0;
    camera.position.z = 9 + sc * 0.004;
    camera.position.y = -sc * 0.0035;
    if (group.current) group.current.rotation.x = -sc * 0.00055;
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={0.7} />
      <pointLight position={[-7, -4, 3]} intensity={40} color={ACCENT} />
      <pointLight position={[7, 3, -2]} intensity={14} color="#ff8a5c" />
      <Physics gravity={[0, 0, 0]}>
        {cards.map((c, i) => (
          <FloatCard key={i} spec={c} seed={i} />
        ))}
        <PointerBall />
      </Physics>
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, zIndex: 1 }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
