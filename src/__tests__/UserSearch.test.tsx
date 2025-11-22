import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import UserTable from '../components/UserTable'
global.fetch = vi.fn()

const mockUsers = [
  {
    id: 1,
    name: 'Leanne Graham',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org'
  },
  {
    id: 2,
    name: 'Ervin Howell',
    email: 'Shanna@melissa.tv',
    phone: '010-692-6593 x09125',
    website: 'anastasia.net'
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    email: 'Nathan@yesenia.net',
    phone: '1-463-123-4447',
    website: 'ramiro.info'
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    email: 'Julianne.OConner@kory.org',
    phone: '493-170-9623 x156',
    website: 'kale.biz'
  }
]

describe('UserTable фильтр по email', () => {
  beforeEach(async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    })

    render(<UserTable />)

    const btn = screen.getByText('Загрузить пользователей')
    fireEvent.click(btn)
    await waitFor(() => {
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.getByText('Clementine Bauch')).toBeInTheDocument()
    })
  })

  it('По умолчанию отображаются все пользователи', () => {
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.getByText('Clementine Bauch')).toBeInTheDocument()
  })

  it('Фильтр не применяется при вводе менее 3 символов', async () => {
    const input = screen.getByPlaceholderText('Поиск по email')
    fireEvent.change(input, { target: { value: 'ap' } })

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
  })

  it('Фильтр применяется при вводе 3+ символов и выводит подходящих пользователей', async () => {
    const input = screen.getByPlaceholderText('Поиск по email')
    fireEvent.change(input, { target: { value: 'sin' } })

    await waitFor(() => {
      expect(screen.queryByText('Leanne Graham')).toBeInTheDocument()
    })
  })

  it('Отображается сообщение "Ничего не найдено" при отсутствии совпадений', async () => {
    const input = screen.getByPlaceholderText('Поиск по email')
    fireEvent.change(input, { target: { value: 'eferferf' } })

    await waitFor(() => {
      expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    })
  })
})
