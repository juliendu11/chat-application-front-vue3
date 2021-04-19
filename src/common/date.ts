import dayjs from 'dayjs'

const formatDateFromNow = (date:Date) => {
  return dayjs(date).fromNow(true)
}

export { formatDateFromNow }
