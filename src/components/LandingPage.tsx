import heroImage from '@/assets/emotion-todo-hero.svg'
import { Box, Button, Container, Heading, HStack, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react'

interface LandingPageProps {
	onStart: () => void
}

function ArrowRightIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="17"
			height="17"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M5 12h14" />
			<path d="m12 5 7 7-7 7" />
		</svg>
	)
}

const features = [
	{
		title: '오늘 감정 기준 추천',
		description: '기분이 가라앉은 날에는 가벼운 일부터, 의욕이 넘치는 날에는 핵심 일부터 보여줍니다.',
	},
	{
		title: '큰 일을 작게 나누기',
		description: '하위 할 일로 쪼개고 접어두며, 복잡한 작업도 부담 없이 정리할 수 있습니다.',
	},
	{
		title: '난이도와 시간 기록',
		description: '난이도, 예상 시간, 집중도를 저장해 지금 감정에 맞는 일을 고르는 데 씁니다.',
	},
]

export function LandingPage({ onStart }: LandingPageProps) {
	return (
		<Box minH="100vh" bg="bg.subtle" color="fg">
			<Box as="header" borderBottomWidth="1px" borderColor="border.subtle" bg="bg.panel">
				<Container maxW="6xl" px={{ base: '5', md: '8' }} py="4">
					<HStack justify="space-between" gap="4">
						<Text as="p" fontSize="lg" fontWeight="extrabold">
							Just To Do
						</Text>
						<Button size="sm" variant="ghost" onClick={onStart}>
							앱 열기
						</Button>
					</HStack>
				</Container>
			</Box>

			<Box as="main">
				<Box as="section" bg="bg.panel">
					<Container maxW="6xl" px={{ base: '5', md: '8' }} py={{ base: '14', md: '20' }}>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: '10', md: '14' }} alignItems="center">
							<VStack align="start" gap="6">
								<VStack align="start" gap="3">
									<Text
										as="p"
										color="purple.500"
										fontWeight="bold"
										fontSize="sm"
										textTransform="uppercase"
										letterSpacing="0"
										>
											감정 기반 할 일 관리 앱
										</Text>
										<Heading as="h1" size={{ base: '4xl', md: '5xl' }} lineHeight="1.05" letterSpacing="0">
											Just To Do
										</Heading>
										<Text as="p" fontSize={{ base: 'lg', md: 'xl' }} color="fg.muted" lineHeight="1.7" maxW="560px">
											오늘 기분에 맞는 할 일을 골라주고, 큰 작업은 작은 단계로 나눠 부담 없이 시작할 수 있게 돕습니다.
										</Text>
								</VStack>

								<HStack gap="3" flexWrap="wrap">
									<Button colorPalette="purple" size="lg" borderRadius="full" onClick={onStart}>
										무료로 시작하기
										<ArrowRightIcon />
									</Button>
									<Button variant="outline" size="lg" borderRadius="full" onClick={onStart}>
										내 할 일 정리하기
									</Button>
								</HStack>
							</VStack>

							<Box
								position="relative"
								minH={{ base: '360px', md: '460px' }}
								display="flex"
								alignItems="center"
								justifyContent="center"
								overflow="hidden"
							>
								<Image
									src={heroImage}
									alt="감정 상태를 선택하면 오늘 할 일을 추천하는 Just To Do 앱 일러스트"
									w={{ base: '300px', md: '420px' }}
									h="auto"
								/>
								<Box
									position="absolute"
									right={{ base: '2', md: '4' }}
									bottom={{ base: '4', md: '8' }}
									bg="bg.subtle"
									borderWidth="1px"
									borderColor="border.subtle"
									borderRadius="lg"
									shadow="lg"
									p="4"
									maxW={{ base: '230px', md: '280px' }}
								>
										<Text fontSize="xs" color="fg.muted" fontWeight="bold" mb="2">
											오늘 추천
										</Text>
										<Text fontWeight="bold">25분 안에 끝나는 쉬운 작업부터</Text>
										<Text fontSize="sm" color="fg.muted" mt="1">
											오늘 감정, 난이도, 시간을 함께 보고 우선순위를 정합니다.
										</Text>
								</Box>
							</Box>
						</SimpleGrid>
					</Container>
				</Box>

				<Box as="section" borderTopWidth="1px" borderColor="border.subtle">
					<Container maxW="6xl" px={{ base: '5', md: '8' }} py={{ base: '10', md: '14' }}>
						<SimpleGrid columns={{ base: 1, md: 3 }} gap="5">
							{features.map(feature => (
								<Box
									key={feature.title}
									bg="bg.panel"
									borderWidth="1px"
									borderColor="border.subtle"
									borderRadius="lg"
									p="5"
								>
									<Heading as="h2" size="md" letterSpacing="0" mb="3">
										{feature.title}
									</Heading>
									<Text color="fg.muted" lineHeight="1.7">
										{feature.description}
									</Text>
								</Box>
							))}
						</SimpleGrid>
					</Container>
				</Box>
			</Box>
		</Box>
	)
}
