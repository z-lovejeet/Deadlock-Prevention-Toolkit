#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    vector<vector<int>> alloc(n, vector<int>(m));
    vector<vector<int>> maxm(n, vector<int>(m));
    vector<int> avail(m);

    // Read Allocation Matrix
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> alloc[i][j];

    // Read Max Matrix
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> maxm[i][j];

    // Read Available
    for (int i = 0; i < m; i++)
        cin >> avail[i];

    vector<vector<int>> need(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            need[i][j] = maxm[i][j] - alloc[i][j];

    vector<int> f(n, 0), ans;
    int count = 0;

    while (count < n) {
        bool found = false;
        for (int i = 0; i < n; i++) {
            if (f[i] == 0) {
                bool canRun = true;
                for (int j = 0; j < m; j++) {
                    if (need[i][j] > avail[j]) {
                        canRun = false;
                        break;
                    }
                }
                if (canRun) {
                    for (int k = 0; k < m; k++)
                        avail[k] += alloc[i][k];
                    ans.push_back(i);
                    f[i] = 1;
                    found = true;
                    count++;
                }
            }
        }
        if (!found) {
            cout << "System is not in a Safe State.\n";
            return 0;
        }
    }

    cout << "System is in a Safe State.\n";
    cout << "Safe Sequence: ";
    for (int i = 0; i < n; i++) {
        cout << "P" << ans[i];
        if (i != n - 1) cout << " -> ";
    }
    cout << endl;

    return 0;
}
