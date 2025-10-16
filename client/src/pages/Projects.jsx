import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function Projects(){
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects')
      return res.data
    },
    retry: false
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-gray-600 mt-1">Manage your projects</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          {isLoading ? 'Loading...' : `${data?.length ?? 0} Projects`}
        </h2>
        {error ? (
          <div className="text-gray-500 py-4">
            Unable to load projects. Please sign in.
          </div>
        ) : null}
        {!isLoading && !error && (!data || data.length === 0) ? (
          <div className="text-gray-400 py-8 text-center">
            No projects yet
          </div>
        ) : null}
        {data?.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {data.map((project) => (
              <div key={project._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold">{project.title}</h2>
                  {project.status ? (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {project.status}
                    </span>
                  ) : null}
                </div>
                {project.description ? (
                  <p className="text-sm text-gray-600">{project.description}</p>
                ) : null}
                {project.milestones?.length ? (
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {project.milestones.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
