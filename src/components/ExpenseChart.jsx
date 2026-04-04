import React, { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

function ExpenseChart({ expenses }) {
  const categories = ['food', 'travel', 'entertainment', 'shopping', 'utilities', 'other']
  const categoryEmojis = {
    food: '🍔',
    travel: '🚗',
    entertainment: '🎬',
    shopping: '🛍️',
    utilities: '💡',
    other: '📝'
  }

  const chartData = useMemo(() => {
    const categoryTotals = {}
    categories.forEach(cat => {
      categoryTotals[cat] = expenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0)
    })

    const labels = categories.map(cat => {
      const emoji = categoryEmojis[cat]
      return `${emoji} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`
    })

    const data = categories.map(cat => categoryTotals[cat])

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(100, 116, 139, 0.8)'
          ],
          borderColor: '#1e293b',
          borderWidth: 2
        }
      ]
    }
  }, [expenses])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 12
          }
        }
      }
    }
  }

  return <Doughnut data={chartData} options={options} />
}

export default ExpenseChart
