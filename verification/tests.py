"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""


TESTS = {
    "Basics": [
        {
            "input": [[
                        ['A', 'B'],
                        ['B', 'C'],
                        ['C', 'D']
                    ], {
                        'A': 10,
                        'B': 20,
                        'C': 30,
                        'D': 40
                    },
                        'A', ['C']],
            "answer": 70,
            "explanation": "Users from node C(30) and D(40) didn't get a message"
        },
        {
            "input": [[
                        ['A', 'B'],
                        ['B', 'D'],
                        ['A', 'C'],
                        ['C', 'D']
                    ], {
                        'A': 10,
                        'B': 0,
                        'C': 0,
                        'D': 40
                    },
                        'A', ['B']],
            "answer": 0,
            "explanation": "Only node B is crashed. A can get access to D through the node C. B doesn't have user, so crashing B doesn't close any user"
        },
        {
            "input": [[
                        ['A', 'B'],
                        ['A', 'C'],
                        ['A', 'D'],
                        ['A', 'E'],
                        ['A', 'F']
                    ], {
                        'A': 10,
                        'B': 10,
                        'C': 10,
                        'D': 10,
                        'E': 10,
                        'F': 10
                    },
                        'C', ['A']],
            "answer": 50,
            "explanation": "Node A is in the center of network. It is the most crusual node. Crashing this node disconnectes all other nodes."
        }
    ],
    "Extra": [
        {
            "input": [[
                        ['A', 'B'],
                        ['B', 'C'],
                        ['C', 'D']
                    ], {
                        'A': 10,
                        'B': 20,
                        'C': 30,
                        'D': 40
                    },
                        'A', ['B']],
            "answer": 90,
            "explanation": "Users from node B(20), C(30) and D(40) didn't get a message"
        },
        {
            "input": [[
                        ['A', 'B'],
                        ['B', 'C'],
                        ['C', 'D']
                    ], {
                        'A': 10,
                        'B': 20,
                        'C': 30,
                        'D': 40
                    },
                        'A', ['D']],
            "answer": 40,
            "explanation": "Only users from D(40) didn't get a message"
        },
        {
            "input": [[
                        ['A', 'B'],
                        ['A', 'C'],
                        ['A', 'D'],
                        ['A', 'E'],
                        ['A', 'F']
                    ], {
                        'A': 10,
                        'B': 10,
                        'C': 10,
                        'D': 10,
                        'E': 10,
                        'F': 10
                    },
                        'A', ['B', 'C']],
            "answer": 20,
            "explanation": "Node A is in the center of network. Since the message goes from this node only crashed nodes didn't get a message."
        }
    ]
}
