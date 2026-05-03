import { EnergySelector } from '@/components/EnergySelector'
import { LandingPage } from '@/components/LandingPage'
import { Onboarding } from '@/components/Onboarding'
import { TodayView } from '@/components/TodayView'
import { TodoInput } from '@/components/TodoInput'
import { TodoList } from '@/components/TodoList'
import { useColorMode } from '@/hooks/useColorMode'
import { useEnergy } from '@/hooks/useEnergy'
import { useStreak } from '@/hooks/useStreak'
import { useTodos } from '@/hooks/useTodos'
import {
	Box,
	Button,
	Center,
	Container,
	Heading,
	HStack,
	IconButton,
	Text,
	VStack,
} from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react'
import { useEffect, useState } from 'react'

type View = 'today' | 'all'
type Screen = 'landing' | 'app'

const LANDING_QUERY_KEYS = ['landing', 'landing-check']

function hasLandingQuery() {
	const params = new URLSearchParams(window.location.search)
	return LANDING_QUERY_KEYS.some(key => params.has(key))
}

function shouldShowLanding() {
	return hasLandingQuery() || localStorage.getItem('just-to-do-started') !== 'true'
}

function MoonIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	)
}
function SunIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="5" />
			<line x1="12" y1="1" x2="12" y2="3" />
			<line x1="12" y1="21" x2="12" y2="23" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
			<line x1="1" y1="12" x2="3" y2="12" />
			<line x1="21" y1="12" x2="23" y2="12" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</svg>
	)
}

export default function App() {
	const [view, setView] = useState<View>('today')
	const [showLanding, setShowLanding] = useState(shouldShowLanding)
	const [showOnboarding, setShowOnboarding] = useState(
		() => localStorage.getItem('just-to-do-onboarded') !== 'true',
	)
	const { colorMode, toggleColorMode } = useColorMode()
	const { energy, setEnergy } = useEnergy()
	const { streak, recordCompletion } = useStreak()
	const {
		todos,
		addTodo,
		addChild,
		toggleTodo,
		deleteTodo,
		editTodo,
		updateMeta,
		toggleCollapse,
		reparentItem,
	} = useTodos()

	useEffect(() => {
		const currentScreen: Screen = showLanding ? 'landing' : 'app'
		if (history.state?.justToDoScreen !== currentScreen) {
			history.replaceState(
				{ ...history.state, justToDoScreen: currentScreen },
				'',
				window.location.href,
			)
		}

		const handlePopState = (event: PopStateEvent) => {
			const screen = event.state?.justToDoScreen as Screen | undefined

			if (screen === 'landing') {
				setShowLanding(true)
				return
			}

			if (screen === 'app') {
				setShowLanding(false)
				return
			}

			setShowLanding(hasLandingQuery())
		}

		window.addEventListener('popstate', handlePopState)
		return () => window.removeEventListener('popstate', handlePopState)
	}, [showLanding])

	const handleStart = () => {
		localStorage.setItem('just-to-do-started', 'true')
		history.pushState({ justToDoScreen: 'app' }, '', window.location.href)
		setShowLanding(false)
	}

	if (showLanding) {
		return (
			<>
				<Analytics />
				<LandingPage onStart={handleStart} />
			</>
		)
	}

	return (
		<>
			<Analytics />
			<Box minH="100vh" bg="bg.subtle" py={{ base: '4', md: '10' }}>
				{showOnboarding && (
					<Onboarding
						energy={energy}
						setEnergy={setEnergy}
						todos={todos}
						addTodo={addTodo}
						addChild={addChild}
						toggleTodo={toggleTodo}
						recordCompletion={recordCompletion}
						onFinish={() => {
							localStorage.setItem('just-to-do-onboarded', 'true')
							setShowOnboarding(false)
						}}
					/>
				)}
				<Container maxW="xl" px={{ base: '4', md: '6' }}>
					<VStack gap={4} align="stretch">
						{/* 헤더 */}
						<Box bg="bg.panel" borderRadius="2xl" p={{ base: '4', md: '5' }} shadow="md">
							<HStack justify="space-between" mb={4}>
								<Heading
									size="lg"
									fontWeight="extrabold"
									letterSpacing="tight"
									background="linear-gradient(to right, var(--chakra-colors-purple-500), var(--chakra-colors-pink-400))"
									style={{
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
									}}
								>
									Just To Do
								</Heading>
								<HStack gap={1}>
									{streak > 1 && (
										<Text fontSize="xs" color="orange.400" fontWeight="bold" mr={1}>
											🔥 {streak}일
										</Text>
									)}
									<IconButton
										aria-label="Toggle color mode"
										onClick={toggleColorMode}
										variant="ghost"
										borderRadius="full"
										size="sm"
									>
										{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
									</IconButton>
								</HStack>
							</HStack>

							{/* 기분 질문 */}
							<Text fontSize="md" fontWeight="bold" textAlign="center" letterSpacing="tight" mb={3}>
								지금 기분이 어때요?
							</Text>

							{/* 에너지 선택 */}
							<EnergySelector value={energy} onChange={setEnergy} />
						</Box>

						{/* 탭 */}
						<HStack gap={2} px={1}>
							<Button
								flex={1}
								size="sm"
								borderRadius="full"
								variant={view === 'today' ? 'solid' : 'outline'}
								colorPalette={view === 'today' ? 'purple' : 'gray'}
								onClick={() => setView('today')}
							>
								오늘 모드
							</Button>
							<Button
								flex={1}
								size="sm"
								borderRadius="full"
								variant={view === 'all' ? 'solid' : 'outline'}
								colorPalette={view === 'all' ? 'purple' : 'gray'}
								onClick={() => setView('all')}
							>
								전체 할 일
							</Button>
						</HStack>

						{/* 오늘 모드 */}
						{view === 'today' && (
							todos.length === 0 ? (
								<Center py={10}>
									<VStack gap={2}>
										<Text fontSize="sm" color="fg.muted">
											할 일이 없어요
										</Text>
										<Button
											size="sm"
											colorPalette="purple"
											variant="ghost"
											onClick={() => setView('all')}
										>
											전체 할 일에서 추가하기 →
										</Button>
									</VStack>
								</Center>
							) : (
								<TodayView
									todos={todos}
									energy={energy}
									onToggle={toggleTodo}
									onRecordCompletion={recordCompletion}
								/>
							)
						)}

						{/* 전체 할 일 (트리 뷰) */}
						{view === 'all' && (
							<>
								<Box bg="bg.panel" borderRadius="xl" shadow="sm" p={{ base: '3', md: '4' }}>
									<TodoInput onAdd={addTodo} />
								</Box>

								{todos.length === 0 ? (
									<Center py={10}>
										<Text color="fg.muted" fontSize="sm">할 일을 추가해보세요!</Text>
									</Center>
								) : (
									<TodoList
										todos={todos}
										onReparent={reparentItem}
										onToggle={toggleTodo}
										onDelete={deleteTodo}
										onEdit={editTodo}
										onAddChild={addChild}
										onToggleCollapse={toggleCollapse}
										onUpdateMeta={updateMeta}
									/>
								)}
							</>
						)}
					</VStack>
				</Container>
			</Box>
		</>
	)
}
