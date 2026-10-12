import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getHomilyWeek } from '@/services/homilyService'

export interface WeekDay {
  date: string
  day: string
  weekday: string
  liturgy: string
}

export const useGetHomilyWeek = () => {
  const query = useQuery({
    queryKey: ['homilyWeek'],
    queryFn: getHomilyWeek
  })

  const days = computed<WeekDay[]>(
    () =>
      query.data.value?.map((item) => {
        const [day, month, year] = item.data.split('/')
        const date = new Date(Number(year), Number(month) - 1, Number(day))

        return {
          date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
          day,
          weekday: new Intl.DateTimeFormat('pt-BR', {
            weekday: 'short'
          })
            .format(date)
            .replace('.', ''),
          liturgy: item.liturgia
        }
      }) ?? []
  )

  return { ...query, days }
}
