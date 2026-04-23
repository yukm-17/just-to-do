import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  IconButton,
  Separator,
  Center,
} from '@chakra-ui/react';
import { useTodos } from './hooks/useTodos';
import { useColorMode } from './hooks/useColorMode';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';
import { TodoStats } from './components/TodoStats';

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  );
}

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
  } = useTodos();

  return (
    <Box minH="100vh" bg="bg.subtle" py={{ base: '6', md: '12' }}>
      <Container maxW="xl" px={{ base: '4', md: '6' }}>
        <VStack gap={6} align="stretch">
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            p={{ base: '4', md: '6' }}
            shadow="md"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
              <Heading
                size="xl"
                fontWeight="extrabold"
                letterSpacing="tight"
                background="linear-gradient(to right, var(--chakra-colors-purple-500), var(--chakra-colors-pink-400))"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                Just To Do
              </Heading>
              <IconButton
                aria-label="Toggle color mode"
                onClick={toggleColorMode}
                variant="ghost"
                borderRadius="full"
                size="sm"
              >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </IconButton>
            </Box>
            <TodoInput onAdd={addTodo} />
          </Box>

          <Box
            bg="bg.panel"
            borderRadius="2xl"
            p={{ base: '4', md: '6' }}
            shadow="md"
          >
            <TodoFilter filter={filter} onFilterChange={setFilter} />
            <Separator my={4} />

            {filteredTodos.length === 0 ? (
              <Center py={10}>
                <Text color="fg.muted" fontSize="sm">
                  {filter === 'completed'
                    ? '완료된 항목이 없습니다'
                    : filter === 'active'
                    ? '진행 중인 항목이 없습니다'
                    : '할 일을 추가해보세요!'}
                </Text>
              </Center>
            ) : (
              <VStack gap={2} align="stretch">
                {filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                ))}
              </VStack>
            )}

            {(activeCount > 0 || completedCount > 0) && (
              <>
                <Separator my={4} />
                <TodoStats
                  activeCount={activeCount}
                  completedCount={completedCount}
                  onClearCompleted={clearCompleted}
                />
              </>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
