import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { usePerformance } from '../../contexts/PerformanceContext';

/**
 * Performance Metrics Dashboard
 * A developer tool to visualize real-time performance metrics in development
 * This component is only included in development builds
 */
const PerformanceDashboard = () => {
  const { metrics, generateReport, resetMetrics } = usePerformance();
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState({
    slowRenders: 0,
    slowInteractions: 0,
    slowApiCalls: 0,
    longTasks: 0,
  });

  // Extract performance metrics for display
  useEffect(() => {
    if (metrics?.summary) {
      setSummary(metrics.summary);
    }
  }, [metrics, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDownloadReport = () => {
    const report = generateReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleResetMetrics = () => {
    resetMetrics();
    setRefreshKey(prev => prev + 1);
  };

  // Format timestamps to readable format
  const formatTime = timestamp => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString();
  };

  // Format duration to readable format
  const formatDuration = ms => {
    if (ms === undefined || ms === null) return 'N/A';
    return `${ms.toFixed(2)}ms`;
  };

  // Get status color based on duration
  const getDurationColor = (duration, thresholds) => {
    const { warning, critical } = thresholds;
    if (duration > critical) return 'error';
    if (duration > warning) return 'warning';
    return 'success';
  };

  // Show performance dashboard only in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: open ? 0 : 'auto',
        right: 20,
        zIndex: 9999,
        width: open ? '90%' : 'auto',
        maxWidth: open ? 900 : 'none',
        maxHeight: open ? '80vh' : 'none',
        overflow: open ? 'auto' : 'visible',
        transition: 'all 0.3s ease',
        boxShadow: open ? 4 : 0,
        borderRadius: 1,
      }}
    >
      {!open ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ opacity: 0.8 }}
        >
          Show Performance Metrics
        </Button>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" component="h2">
              Performance Metrics Dashboard
            </Typography>
            <Box>
              <IconButton onClick={handleRefresh} title="Refresh">
                <RefreshIcon />
              </IconButton>
              <IconButton onClick={handleDownloadReport} title="Download Report">
                <DownloadIcon />
              </IconButton>
              <Button
                variant="outlined"
                size="small"
                color="warning"
                onClick={handleResetMetrics}
                sx={{ mx: 1 }}
              >
                Reset Metrics
              </Button>
              <Button variant="outlined" size="small" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Slow Renders: ${summary.slowRenders}`}
                color={summary.slowRenders > 5 ? 'error' : 'default'}
              />
              <Chip
                label={`Slow API Calls: ${summary.slowApiCalls}`}
                color={summary.slowApiCalls > 5 ? 'error' : 'default'}
              />
              <Chip
                label={`Slow Interactions: ${summary.slowInteractions}`}
                color={summary.slowInteractions > 5 ? 'error' : 'default'}
              />
              <Chip
                label={`Long Tasks: ${summary.longTasks}`}
                color={summary.longTasks > 10 ? 'error' : 'default'}
              />
            </Box>
          </Box>

          {summary.slowRenders > 5 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              High number of slow renders detected. Consider optimizing component rendering with
              useMemo, useCallback, or React.memo.
            </Alert>
          )}

          {summary.slowApiCalls > 5 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              High number of slow API calls detected. Consider implementing caching or server-side
              optimization.
            </Alert>
          )}

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>API Calls Performance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Endpoint</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Cached</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(metrics?.apiCalls || {}).flatMap(([endpoint, calls]) =>
                      calls.map((call, index) => (
                        <TableRow key={`${endpoint}-${index}`}>
                          <TableCell>{endpoint.substring(0, 30)}</TableCell>
                          <TableCell>{call.status}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={formatDuration(call.duration)}
                              color={getDurationColor(call.duration, {
                                warning: 500,
                                critical: 1000,
                              })}
                            />
                          </TableCell>
                          <TableCell>{call.method}</TableCell>
                          <TableCell>{formatTime(call.timestamp)}</TableCell>
                          <TableCell>{call.cached ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))
                    )}
                    {(!metrics?.apiCalls || Object.keys(metrics.apiCalls).length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No API calls recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Component Render Performance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(metrics?.renders || {}).flatMap(([component, renders]) =>
                      renders.map((render, index) => (
                        <TableRow key={`${component}-${index}`}>
                          <TableCell>{component}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={formatDuration(render.duration)}
                              color={getDurationColor(render.duration, {
                                warning: 8,
                                critical: 16,
                              })}
                            />
                          </TableCell>
                          <TableCell>{formatTime(render.timestamp)}</TableCell>
                        </TableRow>
                      ))
                    )}
                    {(!metrics?.renders || Object.keys(metrics.renders).length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No component renders recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>User Interactions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Interaction</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(metrics?.interactions || {}).flatMap(([interaction, events]) =>
                      events.map((event, index) => (
                        <TableRow key={`${interaction}-${index}`}>
                          <TableCell>{interaction}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={formatDuration(event.duration)}
                              color={getDurationColor(event.duration, {
                                warning: 50,
                                critical: 100,
                              })}
                            />
                          </TableCell>
                          <TableCell>{formatTime(event.timestamp)}</TableCell>
                        </TableRow>
                      ))
                    )}
                    {(!metrics?.interactions || Object.keys(metrics.interactions).length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No interactions recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Long Tasks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Duration</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(metrics?.longTasks || []).map((task, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip
                            size="small"
                            label={formatDuration(task.duration)}
                            color={getDurationColor(task.duration, { warning: 100, critical: 200 })}
                          />
                        </TableCell>
                        <TableCell>{formatDuration(task.startTime)}</TableCell>
                        <TableCell>{formatTime(task.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                    {(!metrics?.longTasks || metrics.longTasks.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No long tasks recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Note: This dashboard is only visible in development mode
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PerformanceDashboard;
