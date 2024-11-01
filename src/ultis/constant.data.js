import ManageIndexScreen from "../screens/manage/manage.index.screen";
import AnalyticIndexScreen from "../screens/analytics/analytic.index.screen";
import ReportIndexScreen from "../screens/report/report.index.screen";

export const MAIN_TAB = [
    {
        label: "Quản lý",
        routeName: 'manage_screen',
        component: ManageIndexScreen,
        icon: {
            size: 24,
            name: 'storefront',
            color: '#c4c4c4'
        }
    },
    {
        label: "Thu chi",
        routeName: 'analytic_screen',
        component: AnalyticIndexScreen,
        icon: {
            size: 24,
            name: 'swap-horizontal',
            color: '#c4c4c4'
        }
    },
    {
        label: "Báo cáo",
        routeName: 'report_screen',
        component: ReportIndexScreen,
        icon: {
            size: 24,
            name: 'chart-line-variant',
            color: '#c4c4c4'
        }
    }
]