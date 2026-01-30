title: checkup.title,
      description: checkup.description,
      frequency: checkup.frequency
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this checkup?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Checkups</h1>
            <p className="text-gray-600">Schedule and manage your preventive health screenings</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingCheckup(null);
              setFormData({ title: '', description: '', frequency: 'Yearly' });
            }}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Checkup
          </Button>
        </div>

        {showForm && (
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>{editingCheckup ? 'Edit Checkup' : 'Schedule New Checkup'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Checkup Type</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Annual Physical Exam, Blood Test"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Details</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Comprehensive health screening at City Hospital"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Frequency</Label>
                  <Input
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    placeholder="e.g., Yearly, Every 6 months"
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setEditingCheckup(null);
                      setFormData({ title: '', description: '', frequency: 'Yearly' });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  >
                    {editingCheckup ? 'Update' : 'Schedule'} Checkup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading checkups...</p>
          </div>
        ) : checkups.length > 0 ? (
          <div className="space-y-4">
            {checkups.map((checkup) => (
              <Card key={checkup.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <CalendarCheck className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{checkup.title}</h3>
                          <Badge variant="outline" className="mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {checkup.frequency}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 ml-13 mt-2">{checkup.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(checkup)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(checkup.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-12 pb-12 text-center">
              <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Checkups Scheduled</h3>
              <p className="text-gray-600 mb-6">Schedule your preventive health screenings to stay healthy</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Checkup
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}