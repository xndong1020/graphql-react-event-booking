import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import BookingsPage from '../pages/BookingsPage'
import EventsPage from '../pages/EventsPage'
import NotFoundPage from '../pages/NotFoundPage'

const indexRoutes = [
  { redirect: true, name: 'home', from: '/', to: '/auth' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/bookings', name: 'bookings', component: BookingsPage },
  { path: '/events', name: 'auth', component: EventsPage },
  {
    catch: true,
    name: '404',
    component: NotFoundPage
  } /* catch all route for 404 */
]

export default indexRoutes
