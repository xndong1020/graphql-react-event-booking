import AuthPage from '../pages/AuthPage'
import BookingsPage from '../pages/BookingsPage'
import EventsPage from '../pages/EventsPage'
import NotFoundPage from '../pages/NotFoundPage'

const indexRoutes = [
  { redirect: true, name: 'home', from: '/', to: '/auth' },
  { path: '/auth', name: 'auth', component: AuthPage },
  { path: '/bookings', name: 'auth', component: BookingsPage },
  { path: '/events', name: 'auth', component: EventsPage },
  {
    catch: true,
    name: '404',
    component: NotFoundPage
  } /* catch all route for 404 */
]

export default indexRoutes
