import { useState } from 'react'
import { Box, VStack, HStack, Text, Button, Input, Center } from '@chakra-ui/react'
import { EnergySelector } from './EnergySelector'
import { MetaInput, DEFAULT_META } from './MetaInput'
import { TaskCard } from './TaskCard'
import { getRecommendations } from '@/lib/recommendation'
import { ENERGY_CONFIG, type EnergyLevel, type ScoredTodo } from '@/types/energy'
import type { TaskMeta, Todo } from '@/types/todo'

const TOTAL_STEPS = 7

interface Props {
  energy: EnergyLevel
  setEnergy: (e: EnergyLevel) => void
  todos: Todo[]
  addTodo: (text: string, meta?: TaskMeta) => string
  addChild: (parentId: string, text: string) => void
  toggleTodo: (id: string) => void
  recordCompletion: () => void
  onFinish: () => void
}

function ProgressDots({ step }: { step: number }) {
  return (
    <HStack gap={1.5} justify="center" mb={7}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <Box
          key={i}
          h="6px"
          w={i === step ? '22px' : '6px'}
          borderRadius="full"
          bg={i < step ? 'purple.300' : i === step ? 'purple.500' : 'bg.muted'}
          transition="all 0.35s cubic-bezier(0.4,0,0.2,1)"
        />
      ))}
    </HStack>
  )
}

export function Onboarding({
  energy, setEnergy, todos, addTodo, addChild, toggleTodo, recordCompletion, onFinish,
}: Props) {
  const [step, setStep] = useState(0)
  const [meta, setMeta] = useState<TaskMeta>(DEFAULT_META)
  const [todoText, setTodoText] = useState('')
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [childText, setChildText] = useState('')
  const [savedRec, setSavedRec] = useState<ScoredTodo | null>(null)
  const [praised, setPraised] = useState(false)

  const next = () => setStep(s => s + 1)

  const handleEnergySelect = (e: EnergyLevel) => {
    setEnergy(e)
    setTimeout(next, 180)
  }

  const handleAddTodo = () => {
    const text = todoText.trim()
    if (!text) return
    const id = addTodo(text, meta)
    setCreatedId(id)
    next()
  }

  const handleChildSubmit = () => {
    if (createdId && childText.trim()) {
      addChild(createdId, childText.trim())
    }
    next()
  }

  const goToComplete = () => {
    const recs = getRecommendations(todos, energy)
    const rec = recs.doNow[0] ?? recs.easyPicks[0] ?? null
    setSavedRec(rec)
    next()
  }

  const handleComplete = (id: string) => {
    toggleTodo(id)
    recordCompletion()
    setTimeout(() => setPraised(true), 450)
  }

  const createdTodo = todos.find(t => t.id === createdId) ?? null
  const cfg = ENERGY_CONFIG[energy]
  const liveRecs = step === 5 ? getRecommendations(todos, energy) : null
  const previewRec = liveRecs ? (liveRecs.doNow[0] ?? liveRecs.easyPicks[0] ?? null) : null

  return (
    <Box
      position="fixed"
      top="0" left="0" right="0" bottom="0"
      zIndex={200}
      bg="rgba(0,0,0,0.55)"
      backdropFilter="blur(6px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="bg.panel"
        borderRadius="2xl"
        p={{ base: '5', md: '7' }}
        maxW="420px"
        w="full"
        shadow="2xl"
      >
        <ProgressDots step={step} />

        {/* Step 0: 상태 선택 */}
        {step === 0 && (
          <VStack gap={5} align="stretch">
            <VStack gap={2} align="center" pb={1}>
              <Text fontSize="3xl">👋</Text>
              <Text fontSize="lg" fontWeight="bold">안녕하세요!</Text>
              <Text fontSize="sm" color="fg.muted" textAlign="center" lineHeight="1.6">
                오늘의 에너지에 맞게 할 일을<br />추천해드려요
              </Text>
            </VStack>
            <Text fontSize="sm" fontWeight="semibold" textAlign="center">
              오늘 컨디션이 어때요?
            </Text>
            <EnergySelector value={energy} onChange={handleEnergySelect} />
          </VStack>
        )}

        {/* Step 1: 시간과 에너지 설정 */}
        {step === 1 && (
          <VStack gap={5} align="stretch">
            <VStack gap={1.5} align="start">
              <Text fontSize="lg" fontWeight="bold">⏱ 할 일 정보를 설정해요</Text>
              <Text fontSize="sm" color="fg.muted" lineHeight="1.6">
                난이도·시간·집중도를 기록하면<br />
                지금 에너지에 딱 맞는 할 일을 추천해드려요
              </Text>
            </VStack>
            <Box bg="bg.subtle" borderRadius="xl" p={4}>
              <MetaInput meta={meta} onChange={setMeta} />
            </Box>
            <Button colorPalette="purple" borderRadius="xl" onClick={next}>
              이해했어요 →
            </Button>
          </VStack>
        )}

        {/* Step 2: Todo 입력 */}
        {step === 2 && (
          <VStack gap={5} align="stretch">
            <VStack gap={1.5} align="start">
              <Text fontSize="lg" fontWeight="bold">✏️ 할 일을 추가해볼까요?</Text>
              <Text fontSize="sm" color="fg.muted">
                방금 설정한 정보가 기본값으로 들어가요
              </Text>
            </VStack>
            <Input
              autoFocus
              value={todoText}
              onChange={e => setTodoText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && handleAddTodo()}
              placeholder="할 일을 입력하세요..."
              size="lg"
              borderRadius="xl"
            />
            <Box bg="bg.subtle" borderRadius="xl" p={3}>
              <MetaInput meta={meta} onChange={setMeta} />
            </Box>
            <Button
              colorPalette="purple"
              borderRadius="xl"
              onClick={handleAddTodo}
              disabled={!todoText.trim()}
            >
              추가하기 →
            </Button>
          </VStack>
        )}

        {/* Step 3: 하위 Todo 입력 */}
        {step === 3 && (
          createdTodo ? (
            <VStack gap={5} align="stretch">
              <VStack gap={1.5} align="start">
                <Text fontSize="lg" fontWeight="bold">📦 할 일을 쪼개볼까요?</Text>
                <Text fontSize="sm" color="fg.muted" lineHeight="1.6">
                  큰 일을 작게 나누면 시작하기 훨씬 쉬워요
                </Text>
              </VStack>
              <Box
                bg="bg.subtle"
                borderRadius="xl"
                px={4}
                py={3}
                borderLeft="3px solid"
                borderColor="purple.400"
              >
                <Text fontSize="sm" fontWeight="medium">{createdTodo.text}</Text>
              </Box>
              <Input
                autoFocus
                value={childText}
                onChange={e => setChildText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && handleChildSubmit()}
                placeholder="하위 할 일 입력..."
                borderRadius="xl"
              />
              <HStack gap={2}>
                <Button
                  flex={1}
                  colorPalette="purple"
                  borderRadius="xl"
                  onClick={handleChildSubmit}
                  disabled={!childText.trim()}
                >
                  추가하기
                </Button>
                <Button
                  flex={1}
                  variant="outline"
                  colorPalette="gray"
                  borderRadius="xl"
                  onClick={() => next()}
                >
                  건너뛰기
                </Button>
              </HStack>
            </VStack>
          ) : (
            <VStack gap={4} align="stretch">
              <Text fontSize="sm" color="fg.muted">오류가 발생했어요.</Text>
              <Button colorPalette="purple" borderRadius="xl" onClick={next}>계속하기</Button>
            </VStack>
          )
        )}

        {/* Step 4: DnD 순서 변경 안내 */}
        {step === 4 && (
          <VStack gap={5} align="stretch">
            <VStack gap={1.5} align="start">
              <Text fontSize="lg" fontWeight="bold">↕️ 순서를 자유롭게 바꿔요</Text>
              <Text fontSize="sm" color="fg.muted" lineHeight="1.6">
                할 일을 길게 누른 채 끌면 순서를 바꾸거나,<br />
                다른 항목의 하위로 이동할 수 있어요
              </Text>
            </VStack>
            <Box bg="bg.subtle" borderRadius="xl" p={3}>
              <VStack gap={1.5} align="stretch">
                <Box bg="bg.panel" borderRadius="xl" px={3} py={2.5} shadow="sm">
                  <Text fontSize="sm">📌 중요한 일</Text>
                </Box>
                <Box bg="bg.panel" borderRadius="xl" px={3} py={2.5} shadow="sm" borderLeft="2px solid" borderColor="purple.400">
                  <Text fontSize="sm" color="purple.500" fontWeight="medium">↕ 길게 눌러서 위아래로 드래그</Text>
                </Box>
                <Box bg="bg.panel" borderRadius="xl" px={3} py={2.5} shadow="sm">
                  <Text fontSize="sm">📋 다른 일</Text>
                </Box>
              </VStack>
            </Box>
            <Button colorPalette="purple" borderRadius="xl" onClick={next}>
              이해했어요 →
            </Button>
          </VStack>
        )}

        {/* Step 5: Todo 추천 미리보기 */}
        {step === 5 && (
          <VStack gap={5} align="stretch">
            <VStack gap={1.5} align="start">
              <Text fontSize="lg" fontWeight="bold">
                {cfg.emoji} 추천 할 일이에요
              </Text>
              <Text fontSize="sm" color="fg.muted">
                {cfg.label} 상태에 맞게 골랐어요
              </Text>
            </VStack>
            {previewRec ? (
              <TaskCard item={previewRec} onComplete={() => {}} feedback={null} />
            ) : (
              <Box bg="bg.subtle" borderRadius="xl" px={4} py={3}>
                <Text fontSize="sm" color="fg.muted">
                  추천할 할 일이 없어요. 완료된 항목은 제외돼요.
                </Text>
              </Box>
            )}
            <Button
              colorPalette="purple"
              borderRadius="xl"
              onClick={previewRec ? goToComplete : onFinish}
            >
              {previewRec ? '완료해볼까요? →' : '시작하기 🚀'}
            </Button>
          </VStack>
        )}

        {/* Step 6: 완료 + 칭찬 */}
        {step === 6 && (
          praised ? (
            <VStack gap={5} align="stretch">
              <Center py={6}>
                <VStack gap={3}>
                  <Text fontSize="4xl">🎉</Text>
                  <Text fontSize="xl" fontWeight="extrabold" textAlign="center">
                    정말 잘 했어요!
                  </Text>
                  <Text fontSize="sm" color="fg.muted" textAlign="center" lineHeight="1.6">
                    첫 번째 할 일을 완료했어요.<br />
                    이런 작은 완료가 하루를 만들어요.
                  </Text>
                  <Text fontSize="xs" color="purple.500" textAlign="center" mt={1}>
                    이제 Just To Do를 마음껏 써보세요 ✨
                  </Text>
                </VStack>
              </Center>
              <Button
                colorPalette="purple"
                borderRadius="xl"
                size="lg"
                onClick={onFinish}
                background="linear-gradient(to right, var(--chakra-colors-purple-500), var(--chakra-colors-pink-400))"
              >
                시작하기 🚀
              </Button>
            </VStack>
          ) : (
            <VStack gap={5} align="stretch">
              <VStack gap={1.5} align="start">
                <Text fontSize="lg" fontWeight="bold">☑️ 완료해볼까요?</Text>
                <Text fontSize="sm" color="fg.muted">
                  체크박스를 눌러 첫 번째 할 일을 완료해보세요
                </Text>
              </VStack>
              {savedRec ? (
                <TaskCard item={savedRec} onComplete={handleComplete} feedback={null} />
              ) : (
                <Box bg="bg.subtle" borderRadius="xl" px={4} py={3}>
                  <Text fontSize="sm" color="fg.muted">완료할 할 일이 없어요.</Text>
                </Box>
              )}
              {!savedRec && (
                <Button colorPalette="purple" borderRadius="xl" onClick={onFinish}>
                  시작하기 🚀
                </Button>
              )}
            </VStack>
          )
        )}
      </Box>
    </Box>
  )
}
