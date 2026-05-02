import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

const execAsync = promisify(exec);

// Get password from environment variable
const ADMIN_PASSWORD = process.env.VC_ADMIN_PASSWORD || 'martek2024!secure';

export async function POST(request: Request) {
  try {
    const { password, action, commitHash } = await request.json();

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'getVersions': {
        const { stdout: commits } = await execAsync(
          'git log --pretty=format:"%H|%h|%ar|%ai|%an|%ae|%s" --all'
        );
        
        const versions = commits.split('\n').map((line, index) => {
          const [fullHash, shortHash, relativeDate, isoDate, author, email, message] = line.split('|');
          return {
            id: index + 1,
            version: `v1.0.${index}`,
            fullHash,
            shortHash,
            relativeDate,
            isoDate,
            author,
            email,
            message,
          };
        });

        // Get current branch and total commits
        const { stdout: branch } = await execAsync('git branch --show-current');
        const { stdout: totalCommits } = await execAsync('git rev-list --count HEAD');

        return NextResponse.json({
          versions: versions.reverse(),
          currentBranch: branch.trim(),
          totalCommits: parseInt(totalCommits.trim()),
        });
      }

      case 'getCommitDetails': {
        if (!commitHash) {
          return NextResponse.json(
            { error: 'Commit hash required' },
            { status: 400 }
          );
        }

        // Get commit details
        const { stdout: details } = await execAsync(
          `git show --stat ${commitHash}`
        );

        // Get files changed
        const { stdout: files } = await execAsync(
          `git show --name-status ${commitHash}`
        );

        return NextResponse.json({
          details,
          files,
        });
      }

      case 'rollback': {
        if (!commitHash) {
          return NextResponse.json(
            { error: 'Commit hash required' },
            { status: 400 }
          );
        }

        // Create a backup branch first
        const timestamp = Date.now();
        await execAsync(`git branch backup-${timestamp}`);

        // Perform rollback
        const { stdout } = await execAsync(`git reset --hard ${commitHash}`);

        return NextResponse.json({
          success: true,
          message: `Rolled back to ${commitHash}`,
          backupBranch: `backup-${timestamp}`,
          output: stdout,
        });
      }

      case 'getCurrentStatus': {
        const { stdout: status } = await execAsync('git status --short');
        const { stdout: lastCommit } = await execAsync(
          'git log -1 --pretty=format:"%h - %s (%ar by %an)"'
        );

        return NextResponse.json({
          status,
          lastCommit,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Git operation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
