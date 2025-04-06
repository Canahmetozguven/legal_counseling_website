import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewsIcon,
  ThumbUp as LikesIcon,
  Share as SharesIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

const StatCard = ({ icon, title, value, trend, color }) => (
  <Card>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6">{value}</Typography>
        </Box>
        {trend && (
          <Tooltip title="Trend vs. last month">
            <Box sx={{ color: trend >= 0 ? 'success.main' : 'error.main' }}>
              <TrendingIcon />
              <Typography variant="caption">
                {trend > 0 ? '+' : ''}
                {trend}%
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Stack>
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string.isRequired,
};

const BlogAnalytics = ({ analytics, historicalData }) => {
  const viewsTrend = (
    ((analytics.views - historicalData.lastMonth.views) / historicalData.lastMonth.views) *
    100
  ).toFixed(1);
  const likesTrend = (
    ((analytics.likes - historicalData.lastMonth.likes) / historicalData.lastMonth.likes) *
    100
  ).toFixed(1);
  const sharesTrend = (
    ((analytics.shares - historicalData.lastMonth.shares) / historicalData.lastMonth.shares) *
    100
  ).toFixed(1);

  const viewsData = [
    {
      id: 'views',
      color: 'hsl(207, 70%, 50%)',
      data: historicalData.daily.map(d => ({
        x: new Date(d.date).toLocaleDateString(),
        y: d.views,
      })),
    },
  ];

  const engagementData = [
    {
      id: 'Likes',
      value: analytics.likes,
      color: 'hsl(0, 70%, 50%)',
    },
    {
      id: 'Shares',
      value: analytics.shares,
      color: 'hsl(120, 70%, 50%)',
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Blog Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<ViewsIcon />}
            title="Total Views"
            value={analytics.views}
            trend={viewsTrend}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<LikesIcon />}
            title="Total Likes"
            value={analytics.likes}
            trend={likesTrend}
            color="error"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<SharesIcon />}
            title="Total Shares"
            value={analytics.shares}
            trend={sharesTrend}
            color="success"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Views Over Time
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveLine
                data={viewsData}
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                curve="monotoneX"
                axisBottom={{
                  tickRotation: -45,
                }}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableArea={true}
                areaOpacity={0.1}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Engagement Distribution
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsivePie
                data={engagementData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

BlogAnalytics.propTypes = {
  analytics: PropTypes.shape({
    views: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
    shares: PropTypes.number.isRequired,
  }).isRequired,
  historicalData: PropTypes.shape({
    lastMonth: PropTypes.shape({
      views: PropTypes.number.isRequired,
      likes: PropTypes.number.isRequired,
      shares: PropTypes.number.isRequired,
    }).isRequired,
    daily: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        views: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default BlogAnalytics;
