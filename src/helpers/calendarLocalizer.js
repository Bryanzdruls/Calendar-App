
import { dateFnsLocalizer } from 'react-big-calendar'
import {format, parse, startOfWeek, getDay} from 'date-fns/'
import enUS from 'date-fns/locale/en-US'

import esEs from 'date-fns/locale/es'

const locales = {
    'es': esEs,
  //'en-US': enUS,
}

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})