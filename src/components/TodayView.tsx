import { getRecommendations } from '@/lib/recommendation'
import { ENERGY_CONFIG, type EnergyLevel, type ScoredTodo } from '@/types/energy'
import type { Todo } from '@/types/todo'
import { Badge, Box, Button, Center, HStack, Separator, Text, VStack } from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import { TaskCard } from './TaskCard'

interface Props {
	todos: Todo[]
	energy: EnergyLevel
	onToggle: (id: string) => void
	onRecordCompletion: () => void
}

function SectionHeader({ emoji, title, count }: { emoji: string; title: string; count: number }) {
	return (
		<HStack gap={2}>
			<Text fontSize="sm" fontWeight="bold">
				{emoji} {title}
			</Text>
			{count > 0 && (
				<Badge colorPalette="gray" borderRadius="full" size="sm">
					{count}
				</Badge>
			)}
		</HStack>
	)
}

function Section({
	emoji,
	title,
	items,
	onComplete,
	feedbackId,
}: {
	emoji: string
	title: string
	items: ScoredTodo[]
	onComplete: (id: string, isDoNow: boolean) => void
	feedbackId: string | null
}) {
	if (items.length === 0) return null
	return (
		<VStack gap={2} align="stretch">
			<SectionHeader emoji={emoji} title={title} count={items.length} />
			{items.map(item => (
				<TaskCard
					key={item.todo.id}
					item={item}
					onComplete={id => onComplete(id, emoji === '⚡')}
					feedback={feedbackId === item.todo.id ? '잘 선택했어요! 🎯' : null}
				/>
			))}
		</VStack>
	)
}

export function TodayView({
	todos,
	energy,
	onToggle,
	onRecordCompletion,
}: Props) {
	const [feedbackId, setFeedbackId] = useState<string | null>(null)
	const [deferOpen, setDeferOpen] = useState(false)
	const cfg = ENERGY_CONFIG[energy]

	const recs = useMemo(() => getRecommendations(todos, energy), [todos, energy])

	const handleComplete = useCallback(
		(id: string, isDoNow: boolean) => {
			onToggle(id)
			onRecordCompletion()
			if (isDoNow) {
				setFeedbackId(id)
				setTimeout(() => setFeedbackId(null), 2500)
			}
		},
		[onToggle, onRecordCompletion],
	)

	const allDone = recs.totalIncomplete === 0
	const suggested = cfg.maxSuggested

	return (
		<VStack gap={5} align="stretch">
			{/* 상태 요약 */}
			<Box bg="bg.subtle" borderRadius="xl" p={4}>
				<HStack justify="space-between" mb={1}>
					<Text fontSize="sm" fontWeight="bold" color="fg">
						{cfg.emoji} {cfg.label} 상태예요
					</Text>
				</HStack>
				<Text fontSize="xs" color="fg.muted">
					{cfg.description}
				</Text>
			</Box>

			{/* 과부하 경고 */}
			{recs.isOverloaded && (
				<Box bg="bg.error" borderRadius="xl" px={4} py={3}>
					<Text fontSize="sm" fontWeight="bold">
						⚠️ 할 일이 많아요
					</Text>
					<Text fontSize="xs" color="fg.muted" mt={0.5}>
						{recs.totalIncomplete}개 남아있지만, 오늘은 {suggested}개만 집중해요. 나머지는 내일로
						미뤄도 괜찮아요.
					</Text>
				</Box>
			)}

			{allDone ? (
				<Center py={12}>
					<VStack gap={2}>
						<Text fontSize="2xl">🎉</Text>
						<Text fontSize="sm" fontWeight="bold">
							모든 할 일을 완료했어요!
						</Text>
						<Text fontSize="xs" color="fg.muted">
							오늘도 수고했어요
						</Text>
					</VStack>
				</Center>
			) : (
				<>
					<Section
						emoji="⚡"
						title="지금 하면 좋은 것"
						items={recs.doNow}
						onComplete={handleComplete}
						feedbackId={feedbackId}
					/>

					{recs.doNow.length > 0 && recs.easyPicks.length > 0 && <Separator />}

					<Section
						emoji="😌"
						title="부담 없는 것"
						items={recs.easyPicks}
						onComplete={handleComplete}
						feedbackId={null}
					/>

					{recs.defer.length > 0 && (
						<>
							<Separator />
							<VStack gap={2} align="stretch">
								<HStack justify="space-between">
									<SectionHeader emoji="🕰" title="미뤄도 되는 것" count={recs.defer.length} />
									<Button
										size="xs"
										variant="ghost"
										colorPalette="gray"
										onClick={() => setDeferOpen(v => !v)}
									>
										{deferOpen ? '접기' : '펼치기'}
									</Button>
								</HStack>
								{deferOpen &&
									recs.defer.map(item => (
										<TaskCard
											key={item.todo.id}
											item={item}
											onComplete={id => handleComplete(id, false)}
											feedback={null}
										/>
									))}
							</VStack>
						</>
					)}

				</>
			)}
		</VStack>
	)
}
