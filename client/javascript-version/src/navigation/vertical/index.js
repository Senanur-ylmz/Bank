// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
/*     {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    }, */
    {
      sectionTitle: 'Pages'
    },
    {
      title: 'Golds',
      icon: Login,
      path: '/pages/altinlar',
      openInNewTab: false
    },
    {
      title: 'New Account',
      icon: Login,
      path: '/pages/create_account',
      openInNewTab: false
    },
    {
      title: 'Account List',
      icon: Login,
      path: '/pages/account',
      openInNewTab: false
    },
    {
    title: 'Transaction History',
    icon: Login,
    path: '/pages/transaction_history',
    openInNewTab: false
    },
    {
    title: 'Invoice History',
    icon: Login,
    path: '/pages/invoice_history',
    openInNewTab: false
    },
    {
      title: 'Individual Invoices',
      icon: Login,
      path: '/pages/individual_invoices',
      openInNewTab: false
    },
    {
    title: 'Firm Invoices',
    icon: Login,
    path: '/pages/firm_invoices',
    openInNewTab: false
    },
  ]
}

export default navigation
